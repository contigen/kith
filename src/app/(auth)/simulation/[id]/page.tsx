import { findAgent } from '@/lib/db-queries'
import { SimulationInterface } from '../simulation-interface'

export default async function SimulationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agent = await findAgent(id)
  return <SimulationInterface agent={agent} />
}
