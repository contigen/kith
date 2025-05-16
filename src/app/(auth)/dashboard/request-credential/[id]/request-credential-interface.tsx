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
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { VerifiableCredentialBadge } from '@/components/verifiable-credential-badge'
import { Upload, FileCheck, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Agent } from '@/lib/db-queries'
import { requestCredentialAction } from '@/actions'

// Mock data for agents
const agents = [
  {
    id: '1',
    name: 'GPT-4o Assistant',
    creator: 'OpenAI',
    did: 'did:cheqd:mainnet:zABCDEF123456789',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 95,
    status: 'verified',
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: true },
      { type: 'Capability', verified: true },
    ],
  },
  {
    id: '2',
    name: 'Research Assistant',
    creator: 'AI Research Lab',
    did: 'did:cheqd:mainnet:zGHIJKL987654321',
    logo: '/placeholder.svg?height=64&width=64',
    trustScore: 45,
    status: 'pending',
    credentials: [
      { type: 'Creator', verified: true },
      { type: 'Safety', verified: false },
      { type: 'Capability', verified: false },
    ],
  },
]

// Mock data for issuers
const issuers = [
  { id: '1', name: 'Kith', types: ['Safety', 'Capability'] },
  { id: '2', name: 'OpenAI', types: ['Creator', 'Capability'] },
  { id: '3', name: 'Anthropic', types: ['Creator', 'Safety'] },
  { id: '4', name: 'Google DeepMind', types: ['Creator', 'Capability'] },
]

export function RequestCredentialInterface({ agent }: { agent: Agent }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    credentialType: '',
    issuer: '',
    notes: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  const handleSubmit = async () => {
    if (!formData.credentialType) {
      toast.error('Missing information', {
        description: 'Please fill in all required fields',
      })
      return
    }

    setIsSubmitting(true)
    const { credentialType, notes } = formData

    const response = await requestCredentialAction({
      type: credentialType,
      notes,
      documents: await uploadedFile?.text(),
      requesterId: '',
      credential: {
        create: {
          agentId: agent?.id,
          type: credentialType,
          agent: {
            create: {
              name: agent?.name,
            },
          },
        },
      },
    })

    setIsSubmitting(false)
    if (response) {
      toast.info('Credential Request Submitted', {
        description: 'Your request has been submitted and is pending approval.',
      })
      router.push('/dashboard/credentials')
    } else {
      toast.warning('Credential Request could not be submitted', {
        description: 'Do retry you credential request.',
      })
    }
  }
  if (!agent) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <h2 className='text-xl font-bold mb-2'>Agent Not Found</h2>
        <p className='text-muted-foreground mb-4'>
          The agent you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <a href='/dashboard/agents'>Back to My Agents</a>
        </Button>
      </div>
    )
  }

  const availableCredentialTypes = ['Creator', 'Safety', 'Capability'].filter(
    type => !agent.credentials.find(c => c.type === type && c.verified)
  )

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
          <CardTitle>Agent Information</CardTitle>
          <CardDescription>
            Review the agent information before requesting a credential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-start gap-4'>
            <Avatar className='h-16 w-16 rounded-md'>
              <AvatarImage
                src={agent.logo || '/placeholder.svg'}
                alt={agent.name}
              />
              <AvatarFallback className='rounded-md'>
                {agent.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-bold'>{agent.name}</h3>
                    {agent.credentials.at(-1)?.status?.toLowerCase() ===
                    'verified' ? (
                      <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                        Verified
                      </Badge>
                    ) : agent.credentials.at(-1)?.status?.toLowerCase() ===
                      'pending' ? (
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
                  <p className='text-sm text-muted-foreground'>
                    Created by {agent.creator}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {agent.did}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Provide details for your credential request
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='credentialType'>Credential Type *</Label>
            <Select
              value={formData.credentialType}
              onValueChange={value =>
                handleSelectChange('credentialType', value)
              }
            >
              <SelectTrigger id='credentialType'>
                <SelectValue placeholder='Select credential type' />
              </SelectTrigger>
              <SelectContent>
                {availableCredentialTypes.length > 0 ? (
                  availableCredentialTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type} Credential
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='none' disabled>
                    All credentials already verified
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {availableCredentialTypes.length === 0 && (
              <p className='text-xs text-muted-foreground mt-1'>
                This agent already has all available credential types verified.
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='issuer'>Credential Issuer *</Label>
            <Select
              value={formData.issuer}
              onValueChange={value => handleSelectChange('issuer', value)}
            >
              <SelectTrigger id='issuer'>
                <SelectValue placeholder='Select issuer' />
              </SelectTrigger>
              <SelectContent>
                {formData.credentialType ? (
                  issuers
                    .filter(issuer =>
                      issuer.types.includes(formData.credentialType)
                    )
                    .map(issuer => (
                      <SelectItem key={issuer.id} value={issuer.id}>
                        {issuer.name}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value='none' disabled>
                    Select a credential type first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='file-upload'>Supporting Documentation *</Label>
            <div className='border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center'>
              {uploadedFile ? (
                <div className='flex flex-col items-center gap-2'>
                  <FileCheck className='h-8 w-8 text-primary' />
                  <p className='text-sm font-medium'>{uploadedFile.name}</p>
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
                    Upload documentation to support your credential request
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
              name='notes'
              placeholder='Add any additional information to support your request...'
              value={formData.notes}
              onChange={handleInputChange}
              className='min-h-[100px]'
            />
          </div>
        </CardContent>
        <CardFooter className='flex justify-end'>
          <Button
            variant='outline'
            className='mr-2'
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.credentialType ||
              !formData.issuer ||
              !uploadedFile
            }
            pending={isSubmitting}
          >
            Submit Request
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
