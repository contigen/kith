import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { FileCheck, Info } from 'lucide-react'
import { _FormData } from './type'

export function AgentReviewInterface({
  formData,
  handleBack,
  handleSubmit,
  uploadedModelCard,
  isSubmitting,
  did,
}: {
  formData: _FormData
  did: string
  uploadedModelCard: File | null
  isSubmitting: boolean
  handleBack: () => void
  handleSubmit: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>
          Review your information before submitting
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium'>Basic Information</h3>
            <div className='grid grid-cols-2 gap-2 mt-2'>
              <div className='text-sm font-medium'>Agent Name:</div>
              <div className='text-sm'>{formData.name}</div>
              <div className='text-sm font-medium'>Creator:</div>
              <div className='text-sm'>{formData.creator}</div>
              <div className='text-sm font-medium'>Category:</div>
              <div className='text-sm'>
                {formData.category || 'Not specified'}
              </div>
              <div className='text-sm font-medium'>Contact Email:</div>
              <div className='text-sm'>{formData.contactEmail}</div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className='text-lg font-medium'>DID Information</h3>
            <div className='grid grid-cols-1 gap-2 mt-2'>
              <div className='text-sm font-medium'>DID:</div>
              <div className='text-sm break-all bg-muted p-2 rounded-md'>
                {did}
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className='text-lg font-medium'>Description</h3>
            <p className='text-sm mt-2'>{formData.description}</p>
          </div>
          <Separator />
          <div>
            <h3 className='text-lg font-medium'>Capabilities & Limitations</h3>
            <div className='grid grid-cols-1 gap-4 mt-2'>
              <div>
                <div className='text-sm font-medium'>Capabilities:</div>
                <p className='text-sm mt-1'>{formData.capabilities}</p>
              </div>
              <div>
                <div className='text-sm font-medium'>Limitations:</div>
                <p className='text-sm mt-1'>{formData.limitations}</p>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className='text-lg font-medium'>Uploaded Files</h3>
            <div className='grid grid-cols-1 gap-2 mt-2'>
              <div className='flex items-center justify-between p-2 bg-muted rounded-md'>
                <div className='flex items-center gap-2'>
                  <FileCheck className='h-4 w-4 text-primary' />
                  <span className='text-sm'>
                    Model Card: {uploadedModelCard?.name || 'Not uploaded'}
                  </span>
                </div>
                {uploadedModelCard && (
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700 border-green-200'
                  >
                    Uploaded
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='bg-muted p-4 rounded-md'>
          <div>
            <Info className='h-5 w-5 text-primary mt-0.5' />
            <h4 className='font-medium'>What happens next?</h4>
            <p className='text-sm text-muted-foreground mt-1'>
              After submission, your agent will be registered in the kith
              ecosystem. You&apos;ll need to request credentials from trusted
              issuers to verify your agent&apos;s capabilities and safety. These
              credentials will increase your agent&apos;s trust score and
              visibility in the registry.
            </p>
            <br />

            <h3>Next Steps After Registration</h3>
            <ol className='text-sm text-muted-foreground space-y-1 list-decimal list-inside'>
              <li>
                Request additional credentials to increase your trust score
              </li>
              <li>Complete verification processes with trusted issuers</li>
              <li>
                Update your agent profile with additional information as needed
              </li>
            </ol>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='outline' onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          pending={isSubmitting}
        >
          Submit Registration
        </Button>
      </CardFooter>
    </Card>
  )
}
