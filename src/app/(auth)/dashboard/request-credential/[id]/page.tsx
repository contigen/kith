import { findAgent, findCredentialByID } from '@/lib/db-queries'
import { RequestCredentialInterface } from './request-credential-interface'

export default async function RequestCredentialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agent = await findAgent(id)
  return <RequestCredentialInterface agent={agent} />
}
