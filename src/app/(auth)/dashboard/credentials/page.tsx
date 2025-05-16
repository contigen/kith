import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { getCredentialRequests, getCredentials } from '@/lib/db-queries'
import { redirect } from 'next/navigation'

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

// Mock data for issued credentials
const issuedCredentials = [
  {
    id: '1',
    agentName: 'GPT-4o Assistant',
    agentId: '1',
    type: 'Creator',
    issuer: 'OpenAI',
    issuedDate: '2023-03-15T10:30:00Z',
    expiryDate: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    agentName: 'GPT-4o Assistant',
    agentId: '1',
    type: 'Capability',
    issuer: 'OpenAI',
    issuedDate: '2023-03-25T09:15:00Z',
    expiryDate: '2024-03-25T09:15:00Z',
  },
]

export default async function CredentialsPage() {
  const [credentials, credentialRequests] = await Promise.all([
    getCredentials(),
    getCredentialRequests(),
  ])
  if (!credentials || !credentialRequests)
    redirect('/dashboard/request-credential')

  console.log('credentials: ', credentials)
  console.log('credentialsRequests: ', credentialRequests)

  const handleResubmit = (requestId: string) => {
    toast('Request Resubmitted', {
      description: 'Your credential request has been resubmitted.',
    })
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Credentials</h2>
        <Button asChild>
          <Link href='/dashboard/request-credential'>
            <FileCheck className='mr-2 size-4' />
            Request New Credential
          </Link>
        </Button>
      </div>

      <Tabs defaultValue='requests'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='requests'>Credential Requests</TabsTrigger>
          <TabsTrigger value='issued'>Issued Credentials</TabsTrigger>
        </TabsList>

        <TabsContent value='requests' className='mt-6'>
          {credentialRequests.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <div className='rounded-full bg-muted p-3 mb-4'>
                  <FileCheck className='h-6 w-6' />
                </div>
                <h3 className='text-lg font-medium mb-2'>
                  No Credential Requests
                </h3>
                <p className='text-muted-foreground text-center max-w-md mb-4'>
                  You haven&apos;t made any credential requests yet. Request
                  credentials to increase your agent&apos;s trust score.
                </p>
                <Button asChild>
                  <Link href='/dashboard/request-credential'>
                    Request Credential
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='grid gap-4'>
              {credentialRequests.map(cred => (
                <Card key={cred.id}>
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <div className='flex items-center gap-2 mb-1'>
                          <h3 className='font-medium'>
                            {cred.credential?.type} Credential
                          </h3>
                          {cred.status === 'APPROVED' ? (
                            <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                              Approved
                            </Badge>
                          ) : cred.status === 'PENDING' ? (
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
                          <span className='font-medium'>
                            {cred.credential?.agent.name}
                          </span>
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Issuer: <span className='font-medium'>{'Kith'}</span>
                        </p>
                        <p className='text-xs text-muted-foreground mt-1'>
                          Requested on{' '}
                          {new Date(cred.createdAt).toLocaleDateString()}
                        </p>
                        {cred.status.toLowerCase() === 'rejected' &&
                          cred.notes && (
                            <div className='mt-2 p-2 bg-red-50 text-red-800 rounded-md text-xs'>
                              <div className='flex items-start gap-1'>
                                <AlertCircle className='h-3 w-3 mt-0.5 flex-shrink-0' />
                                <span>{cred.notes}</span>
                              </div>
                            </div>
                          )}
                      </div>
                      <div className='flex items-center'>
                        {cred.status.toLowerCase() === 'approved' ? (
                          <CheckCircle className='h-8 w-8 text-green-500' />
                        ) : cred.status.toLowerCase() === 'pending' ? (
                          <Clock className='h-8 w-8 text-yellow-500' />
                        ) : (
                          <AlertCircle className='h-8 w-8 text-red-500' />
                        )}
                      </div>
                    </div>
                    <div className='flex justify-end mt-4 pt-4 border-t'>
                      {cred.status.toLowerCase() === 'rejected' && (
                        <Button
                          size='sm'
                          className='mr-2'
                          onClick={() => handleResubmit(cred.id)}
                        >
                          Resubmit
                        </Button>
                      )}
                      {cred.status.toLowerCase() === 'pending' && (
                        <Button variant='outline' size='sm' className='mr-2'>
                          Check Status
                        </Button>
                      )}
                      {cred.status.toLowerCase() === 'approved' && (
                        <Button variant='outline' size='sm' className='mr-2'>
                          View Credential
                        </Button>
                      )}
                      <Button variant='outline' size='sm' asChild>
                        <Link href={`/registry/${cred.credential?.agentId}`}>
                          View Agent
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='issued' className='mt-6'>
          {credentials.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <div className='rounded-full bg-muted p-3 mb-4'>
                  <FileCheck className='h-6 w-6' />
                </div>
                <h3 className='text-lg font-medium mb-2'>
                  No Issued Credentials
                </h3>
                <p className='text-muted-foreground text-center max-w-md mb-4'>
                  Your agents don&apos;t have any issued credentials yet.
                  Request credentials to increase your agent&apos;s trust score.
                </p>
                <Button asChild>
                  <Link href='/dashboard/request-credential'>
                    Request Credential
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='grid gap-4'>
              {credentials.map(cred => (
                <Card key={cred.id}>
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <div className='flex items-center gap-2 mb-1'>
                          <h3 className='font-medium'>
                            {cred.type} Credential
                          </h3>
                          <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                            Active
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          For agent:{' '}
                          <span className='font-medium'>{cred.agent.name}</span>
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Issued by:{' '}
                          <span className='font-medium'>{'Kith'}</span>
                        </p>
                        <div className='flex gap-4 mt-1'>
                          <p className='text-xs text-muted-foreground'>
                            Issued: {cred.createdAt.toLocaleDateString()}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Expires: NA
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <CheckCircle className='h-8 w-8 text-green-500' />
                      </div>
                    </div>
                    <div className='flex justify-end mt-4 pt-4 border-t'>
                      <Button variant='outline' size='sm' className='mr-2'>
                        <Search className='mr-2 h-3 w-3' />
                        View Details
                      </Button>
                      <Button variant='outline' size='sm' asChild>
                        <Link href={`/registry/${cred.agentId}`}>
                          <ExternalLink className='mr-2 h-3 w-3' />
                          View Agent
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
