// src/authenticateWithGithub.ts
import { GithubUserData, GithubUserEmailData } from '@/types/github'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { env } from '@saas/env'

// Importando as tipagens de GitHub

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with GitHub',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const githubOAuthURL = new URL(
        'https://github.com/login/oauth/access_token'
      )

      githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
      githubOAuthURL.searchParams.set(
        'client_secret',
        env.GITHUB_OAUTH_CLIENT_SECRET
      )
      githubOAuthURL.searchParams.set(
        'redirect_uri',
        env.GITHUB_OAUTH_CLIENT_REDIRECT_URI
      )
      githubOAuthURL.searchParams.set('code', code)

      const githubAccesTokenResponse = await fetch(githubOAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccesTokenData = await githubAccesTokenResponse.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.string(),
          scope: z.string(),
        })
        .parse(githubAccesTokenData)

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      })

      // Usando type assertion para garantir que a resposta tenha o tipo GithubUserData
      const githubUserData = (await githubUserResponse.json()) as GithubUserData

      // Verifica se o e-mail está visível nos dados do usuário
      let githubUserEmail = githubUserData.email

      if (!githubUserEmail) {
        // Caso o e-mail não esteja visível, busca o e-mail primário da API de e-mails
        const githubUserEmailsResponse = await fetch(
          'https://api.github.com/user/emails',
          {
            headers: {
              Authorization: `Bearer ${githubAccessToken}`,
            },
          }
        )

        const githubUserEmailsData =
          (await githubUserEmailsResponse.json()) as GithubUserEmailData[]

        // Pega o e-mail primário
        const primaryEmail = githubUserEmailsData.find((email) => email.primary)
        githubUserEmail = primaryEmail ? primaryEmail.email : null
      }

      // Agora você tem todos os dados do usuário, incluindo o e-mail (se disponível)
      githubUserData.email = githubUserEmail

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number().int().transform(String),
          avatar_url: z.string().url(),
          name: z.string().nullable(),
          email: z.string().nullable(),
        })
        .parse(githubUserData)

      if (email === null) {
        throw new BadRequestError(
          'Your GitHub account must have an email to authenticate'
        )
      }

      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccounId: githubId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        { sub: user.id },
        {
          sign: {
            expiresIn: '7d',
          },
        }
      )
      return reply.status(201).send({ token })
    }
  )
}
