'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DIDConnectionInterface } from './did-connection-interface'
import { AgentInformation } from './agent-information'
import { AgentCapabilitiesInterface } from './agent-capabilities'
import { AgentReviewInterface } from './agent-review'
import { createAgentAction } from '@/actions'
import { _FormData } from './type'
import { useSession } from 'next-auth/react'

export function RegisterAgentInterface() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [did, setDid] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedModelCard, setUploadedModelCard] = useState<File | null>(null)
  const [formData, setFormData] = useState<_FormData>({
    name: '',
    creator: '',
    description: '',
    category: '',
    capabilities: '',
    limitations: '',
    website: '',
    contactEmail: '',
    logo: null,
    logoUrl: '',
  })

  const [didGenerated, setDidGenerated] = useState(false)
  const { data: session } = useSession()
  const userId = session?.user.id

  function handleInputChange(
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = evt.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.creator || !formData.description) {
        toast.error('Missing information', {
          description: 'Please fill in all required fields',
        })
      }
    } else if (step === 2) {
      if (!didGenerated) {
        toast.error('DID required', {
          description: 'Please connect your DID wallet to continue',
        })
        return
      }
    }

    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    console.log(formData, uploadedModelCard, uploadedFile)
    if (!uploadedModelCard) {
      toast.warning('Missing files', {
        description: 'Please upload all required files',
      })
      return
    }
    setIsSubmitting(true)
    const {
      capabilities,
      limitations,
      category,
      creator,
      description,
      name,
      website,
      contactEmail,
      logoUrl,
    } = formData

    const response = await createAgentAction(
      {
        name,
        description,
        did,
        creator,
        website,
        contactEmail,
        category,
        modelCard: {
          create: {
            overview: await uploadedModelCard?.text(),
            capabilities,
            limitations,
            trainingData: await uploadedModelCard?.text(),
          },
        },
        logo: logoUrl,
        user: {
          connect: {
            id: userId!,
          },
        },
      },
      { capabilities, limitations, category, creator, description }
    )
    setIsSubmitting(false)
    if (response) {
      toast('Agent Registered Successfully', {
        description:
          'Your agent has been registered and is pending credential verification.',
      })
      router.push('/dashboard/agents')
    } else {
      toast('Agent Registration Failed', {
        description: 'Your agent could not be registered. Do retry',
      })
    }
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Register Your AI Agent
        </h1>
        <p className='text-muted-foreground mt-2'>
          Register your AI agent to receive verifiable credentials and join the
          trusted AI ecosystem
        </p>
      </div>

      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}
            ></div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 2
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
            <div
              className={`h-1 w-12 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}
            ></div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 3
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              3
            </div>
            <div
              className={`h-1 w-12 ${step >= 4 ? 'bg-primary' : 'bg-muted'}`}
            ></div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 4
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              4
            </div>
          </div>
          <div className='text-sm text-muted-foreground'>Step {step} of 4</div>
        </div>
      </div>

      {step === 1 && (
        <AgentInformation
          {...{ formData, setFormData, handleNext, handleInputChange }}
        />
      )}

      {step === 2 && (
        <DIDConnectionInterface
          {...{
            handleBack,
            handleNext,
            didGenerated,
            setDidGenerated,
            did,
            setDid,
          }}
        />
      )}

      {step === 3 && (
        <AgentCapabilitiesInterface
          {...{
            formData,
            setUploadedFile,
            setUploadedModelCard,
            handleBack,
            handleInputChange,
            handleNext,
            uploadedFile,
            uploadedModelCard,
          }}
        />
      )}

      {step === 4 && (
        <AgentReviewInterface
          {...{
            formData,
            handleBack,
            handleSubmit,
            did,
            isSubmitting,
            uploadedModelCard,
          }}
        />
      )}
    </div>
  )
}
