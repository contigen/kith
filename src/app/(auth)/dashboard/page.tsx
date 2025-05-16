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
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  MoreHorizontal,
  PlayCircle,
  TrendingUp,
  Users,
  Shield,
  ArrowUpRight,
  ChevronRight,
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

// Mock data for credential requests
const credentialRequests = [
  {
    id: '1',
    agentName: 'GPT-4o Assistant',
    agentId: '1',
    type: 'Safety',
    issuer: 'AI Safety Institute',
    status: 'approved',
    date: '2023-04-12T10:30:00Z',
  },
  {
    id: '2',
    agentName: 'Research Assistant',
    agentId: '2',
    type: 'Creator',
    issuer: 'OpenAI',
    status: 'pending',
    date: '2023-04-11T15:20:00Z',
  },
  {
    id: '3',
    agentName: 'Research Assistant',
    agentId: '2',
    type: 'Safety',
    issuer: 'AI Safety Institute',
    status: 'rejected',
    date: '2023-04-10T09:15:00Z',
    reason: 'Insufficient documentation provided',
  },
]

export default function DashboardPage() {
  // Calculate stats
  const stats = {
    totalAgents: myAgents.length,
    verifiedAgents: myAgents.filter(a => a.status === 'verified').length,
    pendingAgents: myAgents.filter(a => a.status === 'pending').length,
    totalCredentials: myAgents.reduce(
      (acc, agent) => acc + agent.credentials.filter(c => c.verified).length,
      0
    ),
    pendingRequests: credentialRequests.filter(r => r.status === 'pending')
      .length,
  }

  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-gradient-to-br from-background to-primary/5'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Agents
                </p>
                <h3 className='text-2xl font-bold mt-1'>{stats.totalAgents}</h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                <Users className='h-5 w-5 text-primary' />
              </div>
            </div>
            <div className='mt-4 flex items-center text-xs text-muted-foreground'>
              <TrendingUp className='h-3 w-3 mr-1 text-green-500' />
              <span className='text-green-500 font-medium'>+2</span>
              <span className='ml-1'>since last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-background to-green-500/5'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Verified Agents
                </p>
                <h3 className='text-2xl font-bold mt-1'>
                  {stats.verifiedAgents}
                </h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                <Shield className='h-5 w-5 text-green-600' />
              </div>
            </div>
            <div className='mt-4'>
              <div className='flex justify-between text-xs text-muted-foreground mb-1'>
                <span>Verification Rate</span>
                <span>
                  {Math.round((stats.verifiedAgents / stats.totalAgents) * 100)}
                  %
                </span>
              </div>
              <Progress
                value={(stats.verifiedAgents / stats.totalAgents) * 100}
                className='h-1'
              />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-background to-blue-500/5'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Credentials
                </p>
                <h3 className='text-2xl font-bold mt-1'>
                  {stats.totalCredentials}
                </h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                <FileCheck className='h-5 w-5 text-blue-600' />
              </div>
            </div>
            <div className='mt-4 flex items-center text-xs text-muted-foreground'>
              <ArrowUpRight className='h-3 w-3 mr-1 text-green-500' />
              <span className='text-green-500 font-medium'>+5</span>
              <span className='ml-1'>credentials issued</span>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-background to-yellow-500/5'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Pending Requests
                </p>
                <h3 className='text-2xl font-bold mt-1'>
                  {stats.pendingRequests}
                </h3>
              </div>
              <div className='h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center'>
                <Clock className='h-5 w-5 text-yellow-600' />
              </div>
            </div>
            <div className='mt-4'>
              <Button variant='link' className='p-0 h-auto text-xs' asChild>
                <Link href='/dashboard/credentials'>
                  View pending requests
                  <ChevronRight className='h-3 w-3 ml-1' />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold tracking-tight'>My Agents</h2>
          <Button asChild variant='outline' size='sm'>
            <Link href='/dashboard/agents'>
              View All
              <ChevronRight className='ml-1 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='grid gap-4'>
          {myAgents.slice(0, 2).map(agent => (
            <Card
              key={agent.id}
              className='overflow-hidden hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-muted/50'
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
                          {agent.status === 'verified' ? (
                            <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                              Verified
                            </Badge>
                          ) : agent.status === 'pending' ? (
                            <Badge
                              variant='outline'
                              className='bg-yellow-100 text-yellow-800 border-yellow-200'
                            >
                              Pending Verification
                            </Badge>
                          ) : (
                            <Badge variant='destructive'>Rejected</Badge>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground mt-1 truncate max-w-[300px]'>
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
                            <FileCheck className='mr-2 h-4 w-4' />
                            Request Credential
                          </DropdownMenuItem>
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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            asChild
            variant='outline'
            className='h-auto py-6 bg-gradient-to-br from-background to-primary/5 hover:bg-gradient-to-br hover:from-background hover:to-primary/10 border-dashed'
          >
            <Link href='/register' className='flex flex-col items-center gap-2'>
              <Plus className='h-6 w-6' />
              <span>Register New Agent</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Credential Requests */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold tracking-tight'>
            Recent Credential Requests
          </h2>
          <Button asChild variant='outline' size='sm'>
            <Link href='/dashboard/credentials'>
              View All
              <ChevronRight className='ml-1 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='grid gap-4'>
          {credentialRequests.slice(0, 2).map(request => (
            <Card
              key={request.id}
              className='overflow-hidden hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-muted/50'
            >
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='font-bold'>{request.type} Credential</h3>
                      {request.status === 'approved' ? (
                        <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                          Approved
                        </Badge>
                      ) : request.status === 'pending' ? (
                        <Badge
                          variant='outline'
                          className='bg-yellow-100 text-yellow-800 border-yellow-200'
                        >
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant='destructive'>Rejected</Badge>
                      )}
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      For agent:{' '}
                      <span className='font-medium'>{request.agentName}</span>
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Issuer:{' '}
                      <span className='font-medium'>{request.issuer}</span>
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Requested on {new Date(request.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='flex items-center'>
                    {request.status === 'approved' ? (
                      <CheckCircle className='h-8 w-8 text-greexn-500' />
                    ) : request.status === 'pending' ? (
                      <Clock className='h-8 w-8 text-yellow-500' />
                    ) : (
                      <AlertCircle className='h-8 w-8 text-red-500' />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
