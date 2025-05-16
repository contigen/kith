import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'
import { createDIDAction } from '@/actions'

export function DIDConnectionInterface({
  handleBack,
  handleNext,
  didGenerated,
  did,
  setDid,
  setDidGenerated,
}: {
  handleBack: () => void
  handleNext: () => void
  didGenerated: boolean
  did: string
  setDid: Dispatch<SetStateAction<string>>
  setDidGenerated: Dispatch<SetStateAction<boolean>>
}) {
  const [showDidInfo, setShowDidInfo] = useState(false)
  const [pending, setPending] = useState(false)

  async function connectDid() {
    setPending(true)
    try {
      const did = await createDIDAction()
      setDid(did)
    } catch {
      setDidGenerated(false)
      toast('DID Not Created', {
        description: 'Your DID could not be created.',
      })
      return
    } finally {
      setPending(false)
    }
    setDidGenerated(true)
    toast('DID Created', {
      description: 'Your DID has been successfully created.',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>DID Generation</CardTitle>
        <CardDescription>
          Connect your Decentralised Identifier (DID) to your agent
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h3 className='text-lg font-medium'>DID Generation Status</h3>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setShowDidInfo(!showDidInfo)}
            >
              <Info className='h-4 w-4' />
            </Button>
          </div>
          {didGenerated ? (
            <Badge
              variant='outline'
              className='bg-green-50 text-green-700 border-green-200'
            >
              <CheckCircle className='h-3 w-3 mr-1' /> Generated
            </Badge>
          ) : (
            <Badge
              variant='outline'
              className='bg-yellow-50 text-yellow-700 border-yellow-200'
            >
              <AlertCircle className='h-3 w-3 mr-1' /> Not Generated
            </Badge>
          )}
        </div>

        {showDidInfo && (
          <div className='bg-muted p-4 rounded-md text-sm'>
            <h4 className='font-medium mb-2'>What is a DID?</h4>
            <p className='text-muted-foreground mb-2'>
              A Decentralized Identifier (DID) is a new type of identifier that
              enables verifiable, decentralized digital identity. DIDs are used
              to uniquely identify your AI agent in the kith ecosystem.
            </p>
            <p className='text-muted-foreground'>
              By connecting a DID to your agent, you establish ownership and
              enable the issuance of verifiable credentials that attest to your
              agent&apos;s capabilities and safety.
            </p>
          </div>
        )}

        {didGenerated ? (
          <div className='bg-muted/50 p-4 rounded-md border'>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-sm font-medium'>Your DID</span>
                <span className='text-sm text-muted-foreground'>Generated</span>
              </div>
              <div className='p-3 bg-background rounded-md'>
                <code className='text-xs break-all'>{did}</code>
              </div>
              <p className='text-xs text-muted-foreground'>
                This DID will be used to identify your agent and receive
                verifiable credentials.
              </p>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-md'>
            <div className='text-center'>
              <h3 className='font-medium mb-2'>Create Your DID</h3>
            </div>
            <Button onClick={connectDid} disabled={pending} pending={pending}>
              Generate DID
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='outline' onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!didGenerated}>
          Next Step <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </CardFooter>
    </Card>
  )
}
