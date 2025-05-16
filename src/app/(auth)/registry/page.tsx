import { AgentRegistry } from '@/components/agent-registry'
import { RegistryFilters } from '@/components/registry-filters'

export default function RegistryPage() {
  return (
    <div className='container py-8 md:py-12'>
      <div className='flex flex-col gap-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Agent Registry</h1>
          <p className='mt-2 text-muted-foreground'>
            Browse and search verified AI agents in the kith ecosystem
          </p>
        </div>
        <RegistryFilters />
        <AgentRegistry />
      </div>
    </div>
  )
}
