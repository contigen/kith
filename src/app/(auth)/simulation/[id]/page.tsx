'use client'

import { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { VerifiableCredentialBadge } from '@/components/verifiable-credential-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

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
      {
        type: 'Creator',
        verified: true,
        issuer: 'OpenAI',
        issuedDate: '2023-03-15T10:30:00Z',
      },
      {
        type: 'Safety',
        verified: true,
        issuer: 'AI Safety Institute',
        issuedDate: '2023-03-20T14:45:00Z',
      },
      {
        type: 'Capability',
        verified: true,
        issuer: 'OpenAI',
        issuedDate: '2023-03-25T09:15:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Claude 3 Opus',
    creator: 'Anthropic',
    did: 'did:cheqd:mainnet:zGHIJKL987654321',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 92,
    credentials: [
      {
        type: 'Creator',
        verified: true,
        issuer: 'Anthropic',
        issuedDate: '2023-03-15T10:30:00Z',
      },
      {
        type: 'Safety',
        verified: true,
        issuer: 'AI Safety Institute',
        issuedDate: '2023-03-20T14:45:00Z',
      },
      { type: 'Capability', verified: false, issuer: '', issuedDate: '' },
    ],
  },
  {
    id: '3',
    name: 'Gemini Pro',
    creator: 'Google',
    did: 'did:cheqd:mainnet:zMNOPQR456789123',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 88,
    credentials: [
      {
        type: 'Creator',
        verified: true,
        issuer: 'Google',
        issuedDate: '2023-03-15T10:30:00Z',
      },
      { type: 'Safety', verified: false, issuer: '', issuedDate: '' },
      {
        type: 'Capability',
        verified: true,
        issuer: 'Google',
        issuedDate: '2023-03-25T09:15:00Z',
      },
    ],
  },
  {
    id: '4',
    name: 'Llama 3 70B',
    creator: 'Meta',
    did: 'did:cheqd:mainnet:zSTUVWX123789456',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 85,
    credentials: [
      {
        type: 'Creator',
        verified: true,
        issuer: 'Meta',
        issuedDate: '2023-03-15T10:30:00Z',
      },
      {
        type: 'Safety',
        verified: true,
        issuer: 'AI Safety Institute',
        issuedDate: '2023-03-20T14:45:00Z',
      },
      { type: 'Capability', verified: false, issuer: '', issuedDate: '' },
    ],
  },
  {
    id: '5',
    name: 'Mistral Large',
    creator: 'Mistral AI',
    did: 'did:cheqd:mainnet:zYZABCD789123456',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 78,
    credentials: [
      {
        type: 'Creator',
        verified: true,
        issuer: 'Mistral AI',
        issuedDate: '2023-03-15T10:30:00Z',
      },
      { type: 'Safety', verified: false, issuer: '', issuedDate: '' },
      { type: 'Capability', verified: false, issuer: '', issuedDate: '' },
    ],
  },
]

export default function SimulationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [stage, setStage] = useState<
    'loading' | 'verifying' | 'verified' | 'rejected' | 'interacting'
  >('loading')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<
    { role: 'user' | 'agent'; content: string }[]
  >([])
  const [showDetails, setShowDetails] = useState(false)
  const [verificationExpanded, setVerificationExpanded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [agent, setAgent] = useState<unknown>(null)

  useEffect(() => {
    // Find the agent by ID
    const foundAgent = agents.find(a => a.id === params.id)

    if (foundAgent) {
      setAgent(foundAgent)

      // Simulate loading
      const timer = setTimeout(() => {
        setStage('verifying')

        // Start verification progress
        let progressValue = 0
        const progressInterval = setInterval(() => {
          progressValue += 5
          setProgress(progressValue)

          if (progressValue >= 100) {
            clearInterval(progressInterval)
            setStage('verified')
          }
        }, 100)

        return () => clearInterval(progressInterval)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      // Handle agent not found
      router.push('/registry')
    }
  }, [params.id, router])

  const handleRejectCredentials = () => {
    setStage('rejected')
  }

  const handleAcceptCredentials = () => {
    setStage('interacting')
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const newMessages = [...messages, { role: 'user', content: message }]
    setMessages(newMessages)
    setMessage('')

    // Simulate agent response after a short delay
    setTimeout(() => {
      let response = "I'm here to help! What would you like to know?"

      if (newMessages.length === 1) {
        response = `Hello! I'm ${agent?.name}, an AI assistant from ${agent?.creator}. I've been verified for safety and capabilities. How can I assist you today?`
      } else if (
        newMessages[newMessages.length - 1].content
          .toLowerCase()
          .includes('weather')
      ) {
        response =
          "I don't have real-time weather data, but I can help you find a reliable weather service or discuss historical weather patterns if you'd like."
      } else if (
        newMessages[newMessages.length - 1].content
          .toLowerCase()
          .includes('help')
      ) {
        response =
          "I can assist with information, creative content, problem-solving, and more. Just let me know what you need help with, and I'll do my best to assist you!"
      }

      setMessages([...newMessages, { role: 'agent', content: response }])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!agent) {
    return (
      <div className='container py-8 md:py-12'>
        <div className='max-w-4xl mx-auto flex items-center justify-center h-[60vh]'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      </div>
    )
  }

  return (
    <div className='container py-8 md:py-12'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center mb-8'>
          <Button
            variant='ghost'
            size='icon'
            className='mr-2'
            onClick={() => router.push('/registry')}
          >
            <ArrowLeft className='w-5 h-5' />
          </Button>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight'>
              {agent.name} Simulation
            </h1>
            <p className='text-muted-foreground'>
              Experience how verified AI agents present their credentials before
              interaction
            </p>
          </div>
        </div>

        {stage === 'loading' && (
          <Card className='mb-8'>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <Loader2 className='w-12 h-12 mb-4 animate-spin text-primary' />
              <p className='text-lg font-medium'>Loading agent...</p>
            </CardContent>
          </Card>
        )}

        {stage === 'verifying' && (
          <Card className='mb-8 overflow-hidden'>
            <CardHeader>
              <CardTitle>Verifying Agent Credentials</CardTitle>
              <CardDescription>
                Please wait while we verify the agent's credentials
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <div className='absolute inset-0 border-4 rounded-full border-primary/20 border-t-primary animate-spin'></div>
                  <Avatar className='w-16 h-16'>
                    <AvatarImage
                      src={agent.logo || '/placeholder.svg'}
                      alt={agent.name}
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className='text-xl font-bold'>{agent.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    Created by {agent.creator}
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Verifying credentials...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className='h-2' />
              </div>

              <div className='pt-2 space-y-2'>
                <p className='text-sm font-medium'>Verification steps:</p>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle
                      className={cn(
                        'h-4 w-4',
                        progress >= 30 ? 'text-primary' : 'text-muted'
                      )}
                    />
                    <span
                      className={progress >= 30 ? '' : 'text-muted-foreground'}
                    >
                      DID resolution
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle
                      className={cn(
                        'h-4 w-4',
                        progress >= 60 ? 'text-primary' : 'text-muted'
                      )}
                    />
                    <span
                      className={progress >= 60 ? '' : 'text-muted-foreground'}
                    >
                      Credential verification
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle
                      className={cn(
                        'h-4 w-4',
                        progress >= 90 ? 'text-primary' : 'text-muted'
                      )}
                    />
                    <span
                      className={progress >= 90 ? '' : 'text-muted-foreground'}
                    >
                      Trust score calculation
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {stage === 'verified' && (
          <Card className='mb-8 shadow-lg border-primary/20 shadow-primary/5'>
            <CardHeader className='bg-gradient-to-r from-primary/5 to-transparent'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Agent Credentials</CardTitle>
                  <CardDescription>
                    Review the agent's credentials before proceeding with the
                    interaction
                  </CardDescription>
                </div>
                <Shield className='w-8 h-8 text-primary' />
              </div>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='flex items-start gap-4 mb-6'>
                <Avatar className='w-16 h-16 ring-2 ring-primary/20 ring-offset-2'>
                  <AvatarImage
                    src={agent.logo || '/placeholder.svg'}
                    alt={agent.name}
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-xl font-bold'>{agent.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        Created by {agent.creator}
                      </p>
                    </div>
                    <TrustScoreBadge score={agent.trustScore} />
                  </div>
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

              <div
                className='flex items-center justify-between px-2 py-2 transition-colors rounded-md cursor-pointer hover:bg-muted/50'
                onClick={() => setVerificationExpanded(!verificationExpanded)}
              >
                <p className='text-sm font-medium'>Verification Details</p>
                {verificationExpanded ? (
                  <ChevronUp className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </div>

              {verificationExpanded && (
                <div className='p-4 mb-4 text-sm duration-300 rounded-md bg-muted animate-in fade-in-50'>
                  <div className='space-y-3'>
                    <div>
                      <p className='font-medium'>DID Verification</p>
                      <p className='text-xs text-muted-foreground'>
                        {agent.did}
                      </p>
                      <Badge variant='outline' className='mt-1'>
                        Verified
                      </Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className='font-medium'>Credential Issuers</p>
                      <ul className='mt-1 space-y-1 text-xs text-muted-foreground'>
                        {agent.credentials.map(credential => (
                          <li key={credential.type}>
                            {credential.type}:{' '}
                            {credential.verified
                              ? `Issued by ${credential.issuer} on ${new Date(
                                  credential.issuedDate
                                ).toLocaleDateString()}`
                              : 'Not verified'}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <p className='font-medium'>Trust Score Calculation</p>
                      <p className='text-xs text-muted-foreground'>
                        Trust score of {agent.trustScore} is calculated based on
                        credential verification, issuer reputation, and audit
                        history.
                      </p>
                    </div>
                    <div className='flex justify-end'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant='link' size='sm' className='text-xs'>
                            View Full Verification Report
                            <ExternalLink className='w-3 h-3 ml-1' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Verification Report</DialogTitle>
                            <DialogDescription>
                              Detailed verification information for {agent.name}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className='h-[400px] rounded-md border p-4'>
                            <div className='space-y-4'>
                              <div>
                                <h3 className='text-sm font-medium'>
                                  DID Verification
                                </h3>
                                <p className='mt-1 text-sm text-muted-foreground'>
                                  The Decentralized Identifier (DID) {agent.did}{' '}
                                  has been cryptographically verified against
                                  the cheqd mainnet blockchain. The DID is
                                  controlled by {agent.creator} and was last
                                  updated on March 25, 2023.
                                </p>
                              </div>
                              <div>
                                <h3 className='text-sm font-medium'>
                                  Credential Verification
                                </h3>
                                <div className='mt-2 space-y-2'>
                                  {agent.credentials.map(credential => (
                                    <div
                                      key={credential.type}
                                      className='p-3 rounded-md bg-muted/50'
                                    >
                                      <div className='flex items-center justify-between'>
                                        <h4 className='text-sm font-medium'>
                                          {credential.type} Credential
                                        </h4>
                                        <Badge
                                          variant={
                                            credential.verified
                                              ? 'default'
                                              : 'outline'
                                          }
                                        >
                                          {credential.verified
                                            ? 'Verified'
                                            : 'Not Verified'}
                                        </Badge>
                                      </div>
                                      {credential.verified ? (
                                        <p className='mt-1 text-xs text-muted-foreground'>
                                          Issued by {credential.issuer} on{' '}
                                          {new Date(
                                            credential.issuedDate
                                          ).toLocaleDateString()}
                                        </p>
                                      ) : (
                                        <p className='mt-1 text-xs text-muted-foreground'>
                                          No valid credential found
                                        </p>
                                      )}
                                      {credential.verified && (
                                        <p className='mt-1 text-xs text-muted-foreground'>
                                          Signature verified using{' '}
                                          {credential.issuer}'s public key.
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h3 className='text-sm font-medium'>
                                  Trust Score Calculation
                                </h3>
                                <div className='mt-2 space-y-2'>
                                  <div className='grid grid-cols-2 gap-2 text-xs'>
                                    <div>Credential Verification:</div>
                                    <div>
                                      {agent.trustScore >= 90
                                        ? '40/40'
                                        : agent.trustScore >= 80
                                        ? '30/40'
                                        : '20/40'}{' '}
                                      points
                                    </div>
                                    <div>Issuer Reputation:</div>
                                    <div>
                                      {agent.trustScore >= 90
                                        ? '35/40'
                                        : agent.trustScore >= 80
                                        ? '35/40'
                                        : '30/40'}{' '}
                                      points
                                    </div>
                                    <div>Audit History:</div>
                                    <div>
                                      {agent.trustScore >= 90
                                        ? '20/20'
                                        : agent.trustScore >= 80
                                        ? '15/20'
                                        : '10/20'}{' '}
                                      points
                                    </div>
                                    <div className='font-medium'>
                                      Total Score:
                                    </div>
                                    <div className='font-medium'>
                                      {agent.trustScore}/100 points
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className='text-sm font-medium'>
                                  Verification Methodology
                                </h3>
                                <p className='mt-1 text-sm text-muted-foreground'>
                                  All credentials are verified using the W3C
                                  Verifiable Credentials standard. Cryptographic
                                  signatures are validated against issuer public
                                  keys registered on the cheqd blockchain. Trust
                                  scores are calculated using a weighted
                                  algorithm that considers credential types,
                                  issuer reputation, and verification history.
                                </p>
                              </div>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              )}

              <div className='p-4 border rounded-md shadow-sm bg-gradient-to-r from-primary/5 to-transparent border-primary/10'>
                <div className='flex items-start gap-3'>
                  <div className='p-2 rounded-full bg-primary/10'>
                    <CheckCircle className='w-5 h-5 text-primary' />
                  </div>
                  <div>
                    <h4 className='font-medium'>Safe to Proceed</h4>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      This agent has been verified and meets all safety and
                      capability requirements. You can proceed with the
                      interaction.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between bg-gradient-to-r from-transparent to-primary/5'>
              <Button variant='outline' onClick={handleRejectCredentials}>
                <X className='w-4 h-4 mr-2' />
                Reject
              </Button>
              <Button
                onClick={handleAcceptCredentials}
                className='relative overflow-hidden group'
              >
                <span className='relative z-10 flex items-center'>
                  <CheckCircle className='w-4 h-4 mr-2' />
                  Accept & Continue
                </span>
                <div className='absolute inset-0 transition-opacity duration-300 opacity-0 bg-primary group-hover:opacity-10'></div>
              </Button>
            </CardFooter>
          </Card>
        )}

        {stage === 'rejected' && (
          <Card className='mb-8'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Interaction Cancelled</CardTitle>
                <AlertTriangle className='w-6 h-6 text-destructive' />
              </div>
              <CardDescription>
                You've chosen not to proceed with this interaction
              </CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center py-6'>
              <Button onClick={() => router.push('/registry')}>
                Return to Registry
              </Button>
            </CardContent>
          </Card>
        )}

        {stage === 'interacting' && (
          <div className='space-y-4'>
            <Card className='overflow-hidden shadow-lg border-primary/20 shadow-primary/5'>
              <CardHeader className='pb-3 bg-gradient-to-r from-primary/5 to-transparent'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='ring-2 ring-primary/20 ring-offset-1'>
                      <AvatarImage
                        src={agent.logo || '/placeholder.svg'}
                        alt={agent.name}
                      />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{agent.name}</CardTitle>
                      <div className='flex items-center gap-1'>
                        <Badge variant='outline' className='text-xs'>
                          Verified
                        </Badge>
                        <TrustScoreBadge score={agent.trustScore} size='sm' />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-xs'
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? 'Hide Details' : 'Show Credentials'}
                    {showDetails ? (
                      <ChevronUp className='w-3 h-3 ml-1' />
                    ) : (
                      <ChevronDown className='w-3 h-3 ml-1' />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {showDetails && (
                <CardContent className='pb-3 duration-300 animate-in fade-in-50'>
                  <div className='p-3 text-xs rounded-md bg-muted'>
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {agent.credentials.map(credential => (
                        <VerifiableCredentialBadge
                          key={credential.type}
                          type={credential.type}
                          verified={credential.verified}
                        />
                      ))}
                    </div>
                    <p className='text-muted-foreground'>DID: {agent.did}</p>
                    <div className='flex justify-end mt-2'>
                      <Button
                        variant='link'
                        size='sm'
                        className='h-auto p-0 text-xs'
                        onClick={() => setStage('verified')}
                      >
                        View Full Credentials
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}

              <CardContent className='pb-3'>
                <ScrollArea
                  className={cn(
                    'pr-4',
                    messages.length > 0 ? 'h-[400px]' : 'h-[100px]'
                  )}
                >
                  {messages.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-full text-center'>
                      <p className='text-muted-foreground'>
                        Start chatting with the verified AI agent
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={cn(
                            'flex',
                            msg.role === 'user'
                              ? 'justify-end'
                              : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[80%] rounded-lg px-4 py-2',
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className='bg-gradient-to-r from-transparent to-primary/5'>
                <div className='flex items-center w-full space-x-2'>
                  <Input
                    placeholder='Type your message...'
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='border-primary/20 focus-visible:ring-primary/30'
                  />
                  <Button type='submit' size='icon' onClick={handleSendMessage}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4'
                    >
                      <path d='m22 2-7 20-4-9-9-4Z' />
                      <path d='M22 2 11 13' />
                    </svg>
                    <span className='sr-only'>Send</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
