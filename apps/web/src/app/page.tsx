import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Hello Word</h1>
      <br />
      <Button size="sm" asChild>
        <Link href="/auth/sign-in">SignIn</Link>
      </Button>
    </div>
  )
}
