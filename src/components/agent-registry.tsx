'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { VerifiableCredentialBadge } from '@/components/verifiable-credential-badge'
import { ExternalLink, ChevronRight, PlayCircle } from 'lucide-react'

// Mock data for agents
const agents = [
  {
    id: '1',
    name: 'GPT-4o Assistant',
    creator: 'OpenAI',
    did: 'did:cheqd:mainnet:zABCDEF123456789',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 95,
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: true },
      { type: 'Capability', verified: true },
    ],
    lastUpdated: '2023-04-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Claude 3 Opus',
    creator: 'Anthropic',
    did: 'did:cheqd:mainnet:zGHIJKL987654321',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 92,
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: true },
      { type: 'Capability', verified: false },
    ],
    lastUpdated: '2023-04-10T14:45:00Z',
  },
  {
    id: '3',
    name: 'Gemini Pro',
    creator: 'Google',
    did: 'did:cheqd:mainnet:zMNOPQR456789123',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 88,
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: false },
      { type: 'Capability', verified: true },
    ],
    lastUpdated: '2023-04-05T09:15:00Z',
  },
  {
    id: '4',
    name: 'Llama 3 70B',
    creator: 'Meta',
    did: 'did:cheqd:mainnet:zSTUVWX123789456',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 85,
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: true },
      { type: 'Capability', verified: false },
    ],
    lastUpdated: '2023-04-01T16:20:00Z',
  },
  {
    id: '5',
    name: 'Mistral Large',
    creator: 'Mistral AI',
    did: 'did:cheqd:mainnet:zYZABCD789123456',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 78,
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: false },
      { type: 'Capability', verified: false },
    ],
    lastUpdated: '2023-03-28T11:50:00Z',
  },
]

export function AgentRegistry() {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const router = useRouter()

  const toggleExpand = (agentId: string) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId)
  }

  const handleSimulate = (agentId: string) => {
    router.push(`/simulation/${agentId}`)
  }

  return (
    <div className='grid gap-4'>
      {agents.map(agent => (
        <Card
          key={agent.id}
          className='overflow-hidden group hover:shadow-md transition-all duration-300'
        >
          <CardContent className='p-0'>
            <div className='p-6'>
              <div className='flex items-start justify-between'>
                <div className='flex gap-4'>
                  <img
                    src={agent.logo || '/placeholder.svg'}
                    alt={agent.name}
                    className='h-16 w-16 rounded-md object-cover'
                  />
                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-bold'>{agent.name}</h3>
                      <Badge variant='outline'>{agent.creator}</Badge>
                    </div>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {agent.did}
                    </p>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {agent.credentials.map(credential => (
                        <VerifiableCredentialBadge
                          key={credential.type}
                          type={credential.type}
                          verified={credential.verified}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <TrustScoreBadge score={agent.trustScore} />
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => toggleExpand(agent.id)}
                  >
                    <ChevronRight
                      className={`h-5 w-5 transition-transform ${
                        expandedAgent === agent.id ? 'rotate-90' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>
              {expandedAgent === agent.id && (
                <div className='mt-4 pt-4 border-t'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>Last Updated</h4>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(agent.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>
                        Verification Details
                      </h4>
                      <ul className='text-sm text-muted-foreground space-y-1'>
                        {agent.credentials.map(credential => (
                          <li key={credential.type}>
                            {credential.type} Credential:{' '}
                            {credential.verified ? 'Verified' : 'Not Verified'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className='flex justify-end mt-4'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='mr-2'
                      onClick={() => handleSimulate(agent.id)}
                    >
                      <PlayCircle className='mr-2 h-4 w-4' />
                      Try Agent
                    </Button>
                    <Button
                      asChild
                      variant='outline'
                      size='sm'
                      className='mr-2'
                    >
                      <Link href={`/verify?did=${agent.did}`}>
                        Verify Agent
                      </Link>
                    </Button>
                    <Button asChild size='sm'>
                      <Link href={`/registry/${agent.id}`}>
                        View Profile <ExternalLink className='ml-2 h-3 w-3' />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Quick action buttons that appear on hover */}
              <div className='absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Button
                  variant='secondary'
                  size='sm'
                  className='shadow-md'
                  onClick={() => handleSimulate(agent.id)}
                >
                  <PlayCircle className='mr-2 h-4 w-4' />
                  Try Agent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
