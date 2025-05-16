import { getAgents } from '@/lib/db-queries'
import { RequestCredentialView } from './request-credential-view'
import { redirect } from 'next/navigation'

export default async function RequestCredentialPage() {
  const agents = await getAgents()
  if (!agents) redirect('/register')
  return <RequestCredentialView agents={agents} />
}
