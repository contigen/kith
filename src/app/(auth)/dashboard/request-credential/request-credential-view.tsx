'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Agent } from '@/lib/db-queries'

// Mock data for agents
const myAgents = [
  {
    id: '1',
    name: 'GPT-4o Assistant',
    creator: 'OpenAI',
    did: 'did:cheqd:mainnet:zABCDEF123456789',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 95,
    status: 'verified',
  },
  {
    id: '2',
    name: 'Research Assistant',
    creator: 'AI Research Lab',
    did: 'did:cheqd:mainnet:zGHIJKL987654321',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 45,
    status: 'pending',
  },
]

export function RequestCredentialView({
  agents,
}: {
  agents: NonNullable<Agent>[]
}) {
  const router = useRouter()
  const [selectedAgentID, setSelectedAgentID] = useState('')

  const handleContinue = () => {
    if (!selectedAgentID) {
      toast('No agent selected', {
        description: 'Please select an agent to continue',
      })
      return
    }

    router.push(`/dashboard/request-credential/${selectedAgentID}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <h2 className='text-2xl font-bold tracking-tighter'>
          Request Credential
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Agent</CardTitle>
          <CardDescription>
            Choose which agent you want to request a credential for
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='agent'>Agent *</Label>
            <Select value={selectedAgentID} onValueChange={setSelectedAgentID}>
              <SelectTrigger id='agent'>
                <SelectValue placeholder='Select an agent' />
              </SelectTrigger>
              <SelectContent>
                {agents.map(agent => (
                  <SelectItem key={agent?.id} value={agent.id}>
                    <div className='flex items-center gap-2'>
                      <span>{agent.name}</span>
                      {agent.credentials[0]?.verified ? (
                        <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='bg-yellow-100 text-yellow-800 border-yellow-200'
                        >
                          Pending
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAgentID && (
            <div className='pt-4'>
              <div className='p-4 border rounded-md'>
                {(() => {
                  const agent = agents.find(a => a.id === selectedAgentID)
                  if (!agent) return null

                  return (
                    <div className='flex items-start gap-4'>
                      <Avatar className='h-12 w-12 rounded-md'>
                        <AvatarImage
                          src={agent.logo || '/placeholder.svg'}
                          alt={agent.name}
                        />
                        <AvatarFallback className='rounded-md'>
                          {agent.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='flex items-center gap-2'>
                          <h3 className='font-bold'>{agent.name}</h3>
                          {agent.credentials.at(-1)?.verified ? (
                            <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                              Verified
                            </Badge>
                          ) : (
                            <Badge
                              variant='outline'
                              className='bg-yellow-100 text-yellow-800 border-yellow-200'
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Created by {agent.creator}
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>
                          {agent.did}
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex justify-end'>
          <Button onClick={handleContinue} disabled={!selectedAgentID}>
            Continue <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
