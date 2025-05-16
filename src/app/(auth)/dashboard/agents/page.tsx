import { getAgents } from '@/lib/db-queries'
import { AgentsView } from './agents-view'
import { redirect } from 'next/navigation'

export default async function AgentsPage() {
  const agents = await getAgents()
  if (!agents) redirect('/register')
  return <AgentsView agents={agents} />
}
