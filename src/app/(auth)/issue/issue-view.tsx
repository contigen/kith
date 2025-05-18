'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CredentialViewer } from '@/components/credential-viewer'
import {
  Upload,
  FileCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { VerifiableCredentialBadge } from '@/components/verifiable-credential-badge'
import { TrustScoreCalculator } from '@/components/trust-score-calculator'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { VCredentialRequest } from '@/lib/db-queries'
import {
  createCredentialAction,
  issueCredentialAction,
  resolveDIDAction,
} from '@/actions'
import { DIDLinkedResource } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const pendingRequests = [
  {
    id: '1',
    agentName: 'GPT-4o Assistant',
    creator: 'OpenAI',
    did: 'did:cheqd:mainnet:zABCDEF123456789',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 45,
    type: 'Safety',
    requestDate: '2023-04-15T10:30:00Z',
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: false },
      { type: 'Capability', verified: true },
    ],
  },
  {
    id: '2',
    agentName: 'Research Assistant',
    creator: 'AI Research Lab',
    did: 'did:cheqd:mainnet:zGHIJKL987654321',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 30,
    type: 'Creator',
    requestDate: '2023-04-14T14:45:00Z',
    credentials: [
      { type: 'Creator', verified: false },
      { type: 'Safety', verified: false },
      { type: 'Capability', verified: false },
    ],
  },
]

export function IssueView({
  credentialRequests,
}: {
  credentialRequests: VCredentialRequest
}) {
  const [credentialType, setCredentialType] = useState('')
  const [did, setDid] = useState('')
  const [didPreview, setDidPreview] = useState<Record<string, string> | null>(
    null
  )
  const [isIssuing, setIsIssuing] = useState(false)
  const [pending, setPending] = useState(false)
  const [approving, setApproving] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [verificationNote, setVerificationNote] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [reviewTab, setReviewTab] = useState('details')
  const [currentTrustScore] = useState(0)
  const [projectedTrustScore, setProjectedTrustScore] = useState(65)
  const [showTrustScoreCalculator, setShowTrustScoreCalculator] =
    useState(false)
  const [linkedResources, setLinkedResources] =
    useState<Record<string, string>>()
  const router = useRouter()

  const handleResolveDID = async () => {
    if (!did) return
    setPending(true)
    const resolvedDID: DIDLinkedResource = await resolveDIDAction(did)
    setDidPreview({
      name: 'Kith GPT',
      creator: 'Human',
      did,
      trustScore: 45,
      resolvedDID,
    })
    console.log(resolvedDID)
    setLinkedResources(
      resolvedDID.didDocumentMetadata.linkedResourceMetadata[0]
    )
    setPending(false)
    if (credentialType === 'Safety') {
      setProjectedTrustScore(75)
    } else if (credentialType === 'Creator') {
      setProjectedTrustScore(60)
    } else if (credentialType === 'Capability') {
      setProjectedTrustScore(65)
    } else {
      setProjectedTrustScore(45)
    }
  }

  const handleFileUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  const handleIssueCredential = async () => {
    if (!credentialType || !did) {
      toast('Missing information', {
        description: 'Please fill in all required fields',
      })
      return
    }

    setIsIssuing(true)
    const credential = await issueCredentialAction(
      did,
      linkedResources!,
      credentialType
    )
    console.log('credential: ', credential)
    setIsIssuing(false)
    toast.info('Credential Issued Successfully', {
      description: `${credentialType} credential has been issued to ${did} with updated trust score`,
    })

    // Reset form
    setCredentialType('')
    setDid('')
    setDidPreview(null)
    setUploadedFile(null)
    setNotes('')
    setShowTrustScoreCalculator(false)
  }

  const handleApproveRequest = async (
    credentialRequest: VCredentialRequest[0]
  ) => {
    console.log(credentialRequest)
    const { agentId, type } = credentialRequest
    const credentialRequestId = credentialRequest.id
    setApproving(true)
    try {
      const credential = await createCredentialAction(
        {
          type: type || 'Creator Credential',
          verified: true,
          vcData: '',
          status: 'ACTIVE',
          agent: {
            connect: { id: agentId },
          },
          credentialRequest: {
            connect: { id: credentialRequestId },
          },
        },
        agentId,
        credentialRequestId,
        projectedTrustScore
      )
      console.log('credential: ', credential)
      router.push('/dashboard/credentials')
      toast('Request Approved', {
        description:
          'The credential has been issued successfully with updated trust score',
      })
    } catch {
      toast('Request Not Approved', {
        description: 'The credential has not been issued, please retry.',
      })
    } finally {
      setApproving(false)
      setSelectedRequest(null)
    }
  }

  const pendingCredentialRequests = credentialRequests
    .filter(cred => cred.status.toLowerCase() === 'pending')
    .reverse()

  const handleRejectRequest = (requestId: string) => {
    toast('Request Rejected', {
      description: 'The credential request has been rejected',
    })
    setSelectedRequest(null)
  }

  const handleTrustScoreChange = (score: number) => {
    setProjectedTrustScore(score)
  }

  const selectedRequestData = selectedRequest
    ? pendingRequests.find(req => req.id === selectedRequest)
    : null

  useEffect(() => {
    if (selectedRequestData) {
      const baseScore = selectedRequestData.trustScore
      const requestType = selectedRequestData.type

      let projectedScore = baseScore
      if (requestType === 'Safety') {
        projectedScore = Math.min(baseScore + 30, 100)
      } else if (requestType === 'Creator') {
        projectedScore = Math.min(baseScore + 15, 100)
      } else if (requestType === 'Capability') {
        projectedScore = Math.min(baseScore + 20, 100)
      }

      setProjectedTrustScore(projectedScore)
    }
  }, [selectedRequestData])

  return (
    <div className='container py-8 md:py-12'>
      <div className='flex flex-col gap-8 max-w-3xl mx-auto'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold tracking-tighter'>
            Credential Issuer Dashboard
          </h1>
          <p className='text-muted-foreground mt-2'>
            Issue and manage verifiable credentials for AI agents
          </p>
        </div>

        <Tabs defaultValue='requests'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='requests'>Verification Requests</TabsTrigger>
            <TabsTrigger value='issue'>Issue New Credential</TabsTrigger>
          </TabsList>

          <TabsContent value='requests' className='mt-6'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold'>Pending Requests</h2>
                <Badge
                  variant='outline'
                  className='bg-yellow-50 text-yellow-800 border-yellow-200'
                >
                  {pendingCredentialRequests.length} Pending
                </Badge>
              </div>

              {pendingCredentialRequests.length === 0 ? (
                <Card>
                  <CardContent className='flex flex-col items-center justify-center py-12'>
                    <div className='rounded-full bg-muted p-3 mb-4'>
                      <CheckCircle className='h-6 w-6' />
                    </div>
                    <h3 className='text-lg font-medium mb-2'>
                      No Pending Requests
                    </h3>
                    <p className='text-muted-foreground text-center max-w-md'>
                      There are no pending credential verification requests at
                      this time.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className='space-y-4'>
                  {pendingCredentialRequests.map(request => (
                    <Card
                      key={request.id}
                      className={`overflow-hidden ${
                        selectedRequest === request.id
                          ? 'ring-2 ring-primary ring-offset-2'
                          : ''
                      }`}
                    >
                      <CardContent className='p-6'>
                        <div className='flex items-start gap-4'>
                          <Avatar className='h-12 w-12 rounded-md'>
                            <AvatarImage
                              src={request.agent.logo || '/placeholder.svg'}
                              alt={request.agent.name}
                            />
                            <AvatarFallback className='rounded-md'>
                              {request.agent.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between'>
                              <div>
                                <div className='flex items-center gap-2'>
                                  <h3 className='font-bold'>
                                    {request.agent.name}
                                  </h3>
                                  <Badge variant='outline'>
                                    {request.type} Credential
                                  </Badge>
                                </div>
                                <p className='text-sm text-muted-foreground'>
                                  Created by {request.agent.creator}
                                </p>
                                <p className='text-xs text-muted-foreground mt-1'>
                                  {request.agent.did}
                                </p>
                              </div>
                              <div className='flex items-center gap-2'>
                                <TrustScoreBadge
                                  score={request.agent.trustScore}
                                  size='sm'
                                />
                                <Badge
                                  variant='outline'
                                  className='bg-yellow-50 text-yellow-800 border-yellow-200'
                                >
                                  <Clock className='mr-1 h-3 w-3' />
                                  Pending
                                </Badge>
                              </div>
                            </div>
                            <div className='flex flex-wrap gap-2 mt-2'>
                              {request.credential && (
                                <VerifiableCredentialBadge
                                  key={request.credential.type}
                                  type={request.credential.type}
                                  verified={request.credential.verified}
                                />
                              )}
                            </div>
                            <p className='text-xs text-muted-foreground mt-2'>
                              Requested on{' '}
                              {request.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {selectedRequest === request.id ? (
                          <div className='mt-4 pt-4 border-t'>
                            <Tabs
                              value={reviewTab}
                              onValueChange={setReviewTab}
                            >
                              <TabsList className='grid w-full grid-cols-3'>
                                <TabsTrigger value='details'>
                                  Request Details
                                </TabsTrigger>
                                <TabsTrigger value='trust-score'>
                                  Trust Score Impact
                                </TabsTrigger>
                                <TabsTrigger value='decision'>
                                  Decision
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent
                                value='details'
                                className='mt-4 space-y-4'
                              >
                                <div className='space-y-2'>
                                  <Label>Credential Type</Label>
                                  <div className='p-2 bg-muted rounded-md'>
                                    {request.type} Credential
                                  </div>
                                </div>

                                <div className='space-y-2'>
                                  <Label>Verification Evidence</Label>
                                  <div className='p-4 border rounded-md flex items-center gap-3'>
                                    <FileCheck className='h-5 w-5 text-primary' />
                                    <div>
                                      <p className='text-sm font-medium'>
                                        safety_audit_report.pdf
                                      </p>
                                      <p className='text-xs text-muted-foreground'>
                                        Uploaded on{' '}
                                        {request.createdAt.toLocaleDateString()}
                                      </p>
                                    </div>
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      className='ml-auto'
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>

                                <div className='space-y-2'>
                                  <Label>Agent Information</Label>
                                  <div className='p-4 border rounded-md space-y-2'>
                                    <div className='grid grid-cols-2 gap-2 text-sm'>
                                      <div className='text-muted-foreground'>
                                        Name:
                                      </div>
                                      <div>{request.agent.name}</div>
                                      <div className='text-muted-foreground'>
                                        Creator:
                                      </div>
                                      <div>{request.agent.name}</div>
                                      <div className='text-muted-foreground'>
                                        DID:
                                      </div>
                                      <div className='truncate'>
                                        {request.agent.did}
                                      </div>
                                      <div className='text-muted-foreground'>
                                        Current Trust Score:
                                      </div>
                                      <div>
                                        <TrustScoreBadge
                                          score={request.agent.trustScore}
                                          size='sm'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent
                                value='trust-score'
                                className='mt-4 space-y-4'
                              >
                                <div className='flex items-center justify-between p-4 border rounded-md bg-muted/50'>
                                  <div className='flex items-center gap-3'>
                                    <Shield className='h-5 w-5 text-primary' />
                                    <div>
                                      <h3 className='text-sm font-medium'>
                                        Trust Score Impact
                                      </h3>
                                      <p className='text-xs text-muted-foreground'>
                                        Issuing this credential will affect the
                                        agent&apos;s trust score
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                      setShowTrustScoreCalculator(
                                        !showTrustScoreCalculator
                                      )
                                    }
                                  >
                                    {showTrustScoreCalculator
                                      ? 'Hide Calculator'
                                      : 'Show Calculator'}
                                  </Button>
                                </div>

                                <div className='flex items-center justify-between gap-4 p-4 border rounded-md'>
                                  <div className='space-y-1'>
                                    <div className='text-sm font-medium'>
                                      Current Trust Score
                                    </div>
                                    <TrustScoreBadge
                                      score={request.agent.trustScore}
                                      size='lg'
                                    />
                                  </div>

                                  <div className='flex-1 flex items-center justify-center'>
                                    <ArrowRight className='h-6 w-6 text-muted-foreground' />
                                  </div>

                                  <div className='space-y-1'>
                                    <div className='text-sm font-medium'>
                                      Projected Trust Score
                                    </div>
                                    <TrustScoreBadge
                                      score={projectedTrustScore}
                                      size='lg'
                                    />
                                  </div>
                                </div>

                                <div className='space-y-2'>
                                  <div className='flex justify-between text-sm'>
                                    <span>Score Improvement</span>
                                    <span>
                                      +
                                      {projectedTrustScore -
                                        (request.agent?.trustScore ?? 0) ||
                                        0}{' '}
                                      points
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      projectedTrustScore -
                                        (request.agent?.trustScore ?? 0) || 0
                                    }
                                    max={100}
                                    className='h-2'
                                  />
                                  <p className='text-xs text-muted-foreground'>
                                    {request.type === 'Safety'
                                      ? 'Safety credentials have a significant impact on trust scores.'
                                      : "This credential will moderately improve the agent's trust score."}
                                  </p>
                                </div>

                                {showTrustScoreCalculator && (
                                  <div className='mt-4'>
                                    <TrustScoreCalculator
                                      initialCredentials={[
                                        {
                                          type: 'Creator',
                                          verified:
                                            request.credential?.verified ||
                                            false,
                                          weight: 30,
                                        },
                                        {
                                          type: 'Safety',
                                          verified:
                                            request.type === 'Safety'
                                              ? true
                                              : request.credential?.verified ||
                                                false,
                                          weight: 40,
                                        },
                                        {
                                          type: 'Capability',
                                          verified:
                                            request.credential?.verified ||
                                            false,
                                          weight: 30,
                                        },
                                      ]}
                                      onScoreChange={handleTrustScoreChange}
                                    />
                                  </div>
                                )}
                              </TabsContent>

                              <TabsContent
                                value='decision'
                                className='mt-4 space-y-4'
                              >
                                <div className='space-y-2'>
                                  <Label htmlFor={`notes-${request.id}`}>
                                    Verification Notes
                                  </Label>
                                  <Textarea
                                    id={`notes-${request.id}`}
                                    placeholder='Add notes about your verification decision...'
                                    className='mt-2'
                                    value={verificationNote}
                                    onChange={({ currentTarget: { value } }) =>
                                      setVerificationNote(value)
                                    }
                                  />
                                </div>

                                <div className='p-4 border rounded-md bg-muted/50'>
                                  <div className='flex items-start gap-3'>
                                    <AlertCircle className='h-5 w-5 text-amber-500 mt-0.5' />
                                    <div>
                                      <h4 className='text-sm font-medium'>
                                        Verification Responsibility
                                      </h4>
                                      <p className='text-xs text-muted-foreground mt-1'>
                                        By approving this request, you are
                                        certifying that you have verified the
                                        agent&apos;s credentials according to
                                        the platform&apos;s standards. This will
                                        affect the agent&apos;s trust score and
                                        visibility in the registry.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className='flex justify-end gap-2 mt-4'>
                                  <Button
                                    variant='outline'
                                    onClick={() => setSelectedRequest(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant='destructive'
                                    onClick={() =>
                                      handleRejectRequest(request.id)
                                    }
                                  >
                                    <AlertCircle className='mr-2 size-4' />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleApproveRequest(request)
                                    }
                                    disabled={approving}
                                    pending={approving}
                                  >
                                    <CheckCircle className='mr-2 size-4' />
                                    Approve & Issue
                                  </Button>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        ) : (
                          <div className='flex justify-end mt-4 pt-4 border-t'>
                            <Button variant='outline' className='mr-2' asChild>
                              <Link
                                href={`/registry/${request.agent.id}`}
                                target='_blank'
                              >
                                View Agent
                              </Link>
                            </Button>
                            <Button
                              onClick={() => setSelectedRequest(request.id)}
                            >
                              Review Request
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='issue' className='mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Issue New Credential</CardTitle>
                <CardDescription>
                  Create and issue a verifiable credential for an AI agent
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='credential-type'>Credential Type</Label>
                  <Select
                    value={credentialType}
                    onValueChange={value => {
                      setCredentialType(value)
                      if (didPreview) {
                        if (value === 'Safety') {
                          setProjectedTrustScore(75)
                        } else if (value === 'Creator') {
                          setProjectedTrustScore(60)
                        } else if (value === 'Capability') {
                          setProjectedTrustScore(65)
                        } else {
                          setProjectedTrustScore(currentTrustScore)
                        }
                      }
                    }}
                  >
                    <SelectTrigger id='credential-type'>
                      <SelectValue placeholder='Select credential type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Creator'>
                        Creator Verification
                      </SelectItem>
                      <SelectItem value='Safety'>Safety Audit</SelectItem>
                      <SelectItem value='Capability'>
                        Capability Assessment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='did'>Agent DID</Label>
                  <div className='flex gap-2'>
                    <Input
                      id='did'
                      placeholder='Enter DID (did:cheqd:...)'
                      value={did}
                      onChange={e => setDid(e.target.value)}
                      className='flex-1'
                    />
                    <Button
                      variant='outline'
                      onClick={handleResolveDID}
                      disabled={!did || pending}
                      pending={pending}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>

                {didPreview && (
                  <div className='p-4 border rounded-md bg-muted/50'>
                    <h3 className='font-medium mb-2'>DID Resolution Preview</h3>
                    <div className='grid grid-cols-2 gap-2 text-sm'>
                      <div className='text-muted-foreground'>Name:</div>
                      <div>{didPreview.name}</div>
                      <div className='text-muted-foreground'>Creator:</div>
                      <div>{didPreview.creator}</div>
                      <div className='text-muted-foreground'>DID:</div>
                      <div className='truncate'>{didPreview.did}</div>
                      <div className='text-muted-foreground'>Resolved DID:</div>
                      <pre className='text-wrap break-all'>
                        {JSON.stringify(didPreview.resolvedDID, null, 2)}
                      </pre>
                      <div className='text-muted-foreground'>
                        Current Trust Score:
                      </div>
                      <div>
                        <TrustScoreBadge score={currentTrustScore} size='sm' />
                      </div>
                    </div>
                  </div>
                )}
                <div className='space-y-2'>
                  <Label htmlFor='file-upload'>
                    Upload Verification Evidence
                  </Label>
                  <div className='border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center'>
                    {uploadedFile ? (
                      <div className='flex flex-col items-center gap-2'>
                        <FileCheck className='h-8 w-8 text-primary' />
                        <p className='text-sm font-medium'>
                          {uploadedFile.name}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {Math.round(uploadedFile.size / 1024)} KB
                        </p>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setUploadedFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center gap-2'>
                        <Upload className='h-8 w-8 text-muted-foreground' />
                        <p className='text-sm text-muted-foreground'>
                          Drag and drop or click to upload
                        </p>
                        <Input
                          id='file-upload'
                          type='file'
                          className='hidden'
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            document.getElementById('file-upload')?.click()
                          }
                        >
                          Select File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='notes'>Additional Notes</Label>
                  <Textarea
                    id='notes'
                    placeholder='Add any additional information about this credential...'
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>

                <div className='pt-4 border-t'>
                  <h3 className='font-medium mb-4'>Credential Preview</h3>
                  {credentialType && did ? (
                    <CredentialViewer
                      type={credentialType}
                      issuer='Your Organization'
                      issuedDate={new Date().toISOString()}
                      subject={did}
                    />
                  ) : (
                    <div className='p-4 border rounded-md bg-muted/50 text-center text-sm text-muted-foreground'>
                      Select a credential type and enter a DID to preview
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleIssueCredential}
                  disabled={isIssuing || !credentialType || !did}
                  className='w-full'
                  pending={isIssuing}
                >
                  <CheckCircle className='mr-2 size-4' />
                  Issue Cheqd Credential
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
