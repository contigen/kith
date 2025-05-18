'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { VerifiableCredentialBadge } from '@/components/verifiable-credential-badge'
import {
  Plus,
  FileCheck,
  ExternalLink,
  MoreHorizontal,
  PlayCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Agent } from '@/lib/db-queries'

// Mock data for registered agents
const myAgents = [
  {
    id: '1',
    name: 'GPT-4o Assistant',
    did: 'did:cheqd:mainnet:zABCDEF123456789',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 95,
    status: 'verified',
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: true },
      { type: 'Capability', verified: true },
    ],
    lastUpdated: '2023-04-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Research Assistant',
    did: 'did:cheqd:mainnet:zGHIJKL987654321',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 45,
    status: 'pending',
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: false },
      { type: 'Capability', verified: false },
    ],
    lastUpdated: '2023-04-10T14:45:00Z',
  },
  {
    id: '3',
    name: 'Customer Support Bot',
    did: 'did:cheqd:mainnet:zXYZ123456789',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 78,
    status: 'verified',
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: true },
      { type: 'Capability', verified: false },
    ],
    lastUpdated: '2023-04-05T08:20:00Z',
  },
]

export function AgentsView({ agents }: { agents: NonNullable<Agent>[] }) {
  //   const [agents, setAgents] = useState(myAgents)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('trustScore')

  const verifiedAgents = agents.map(agent => {
    const verified = agent.credentials.some(cred => cred.verified)
    return { ...agent, verified }
  })

  const filteredAgents = verifiedAgents
    .filter(
      agent =>
        (searchQuery === '' ||
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.did.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === 'all' || agent.verified === statusFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'trustScore') return b.trustScore - a.trustScore
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'date')
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      return 0
    })

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>My Agents</h2>
          <p className='text-muted-foreground'>
            Manage and monitor your registered AI agents
          </p>
        </div>
        <Button asChild>
          <Link href='/register'>
            <Plus className='mr-2 h-4 w-4' />
            Register New Agent
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search by name or DID...'
                className='pl-10'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='flex gap-2'>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[140px]'>
                  <div className='flex items-center gap-2'>
                    <Filter className='h-4 w-4' />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value='verified'>Verified</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-[140px]'>
                  <div className='flex items-center gap-2'>
                    <ArrowUpDown className='h-4 w-4' />
                    <span>Sort By</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='trustScore'>Trust Score</SelectItem>
                  <SelectItem value='name'>Name (A-Z)</SelectItem>
                  <SelectItem value='date'>Last Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredAgents.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <div className='rounded-full bg-muted p-3 mb-4'>
              <Plus className='h-6 w-6' />
            </div>
            <h3 className='text-lg font-medium mb-2'>No Agents Found</h3>
            <p className='text-muted-foreground text-center max-w-md mb-4'>
              {searchQuery || statusFilter !== 'all'
                ? 'No agents match your current filters. Try adjusting your search criteria.'
                : "You haven't registered any AI agents yet. Register your first agent to get started."}
            </p>
            <Button asChild>
              <Link href='/register'>Register New Agent</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4'>
          {filteredAgents.map(agent => (
            <AgentsCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}

export function AgentsCard({
  agent,
}: {
  agent: NonNullable<Agent & { verified: boolean }>
}) {
  return (
    <Card
      key={agent.id}
      className='overflow-hidden hover:shadow-md transition-all duration-300'
    >
      <CardContent className='p-0'>
        <div className='p-6'>
          <div className='flex items-start justify-between'>
            <div className='flex gap-4'>
              <Avatar className='h-16 w-16 rounded-md'>
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
                  {agent.verified ? (
                    <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='bg-yellow-100 text-yellow-800 border-yellow-200'
                    >
                      Pending Verification
                    </Badge>
                  )}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href={`/simulation/${agent.id}`}
                      className='flex items-center w-full'
                    >
                      <PlayCircle className='mr-2 h-4 w-4' />
                      Try Agent
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/registry/${agent.id}`}
                      className='flex items-center w-full'
                    >
                      <ExternalLink className='mr-2 h-4 w-4' />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/dashboard/request-credential/${agent.id}`}
                      className='flex items-center w-full'
                    >
                      <FileCheck className='mr-2 h-4 w-4' />
                      Request Credential
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href={`/dashboard/edit-agent/${agent.id}`}
                      className='flex items-center w-full'
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      Edit Agent
                    </Link>
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={e => e.preventDefault()}
                        className='text-destructive'
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete Agent
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your agent and remove all associated
                          credentials.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className='mt-4 pt-4 border-t'>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between text-sm'>
                <span>Trust Score</span>
                <span>{agent.trustScore}%</span>
              </div>
              <Progress value={agent.trustScore} className='h-2' />
              <div className='flex justify-between items-center'>
                <p className='text-xs text-muted-foreground'>
                  {agent.trustScore < 70
                    ? 'Request more credentials to increase your trust score'
                    : 'Your agent has a good trust score'}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Last updated:{' '}
                  {new Date(agent.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className='flex justify-end mt-4'>
              {agent.trustScore < 70 && (
                <Button asChild size='sm' className='mr-2'>
                  <Link href={`/dashboard/request-credential/${agent.id}`}>
                    <FileCheck className='mr-2 h-3 w-3' />
                    Request Credentials
                  </Link>
                </Button>
              )}
              <Button asChild size='sm'>
                <Link href={`/registry/${agent.id}`}>
                  View Profile <ExternalLink className='ml-2 h-3 w-3' />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
