import { defineAbilityFor, projectSchema } from '@saas/auth'
const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-id' })

const project = projectSchema.parse({ id: 'project-id', ownerId: 'user2-id' })

const userCanInviteSomeoneElse = ability.can('create', 'Invite')
const userCanDeleteOtherUsers = ability.can('delete', 'User')
const userCanDeleteProjetc = ability.can('delete', project)

const userCannotDeleteOtherUsers = ability.cannot('delete', 'User')
const userCanGetBilling = ability.can('get', 'Billing')

console.log(userCanInviteSomeoneElse)
console.log(userCanDeleteOtherUsers)
console.log(userCanDeleteProjetc)
console.log(userCannotDeleteOtherUsers)
console.log(userCanGetBilling)
