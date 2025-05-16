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
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileCheck, Upload, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { _FormData } from './type'
import { Dispatch, SetStateAction } from 'react'

export function AgentCapabilitiesInterface({
  formData,
  setUploadedModelCard,
  setUploadedFile,
  handleBack,
  handleNext,
  handleInputChange,
  uploadedFile,
  uploadedModelCard,
}: {
  uploadedFile: File | null
  uploadedModelCard: File | null
  formData: _FormData
  setUploadedModelCard: Dispatch<SetStateAction<File | null>>
  setUploadedFile: Dispatch<SetStateAction<File | null>>
  handleBack: () => void
  handleNext: () => void
  handleInputChange(
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void
}) {
  const handleFileUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files && evt.target.files[0]) {
      setUploadedFile(evt.target.files[0])
    }
  }

  const handleModelCardUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files && evt.target.files[0]) {
      setUploadedModelCard(evt.target.files[0])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Capabilities</CardTitle>
        <CardDescription>
          Provide detailed information about your agent&apos;s capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='capabilities'>Capabilities *</Label>
          <Textarea
            id='capabilities'
            name='capabilities'
            placeholder="List your agent's capabilities (e.g., text generation, image recognition, etc.)"
            value={formData.capabilities}
            onChange={handleInputChange}
            className='min-h-[100px]'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='limitations'>Limitations *</Label>
          <Textarea
            id='limitations'
            name='limitations'
            placeholder="Describe your agent's limitations and potential risks"
            value={formData.limitations}
            onChange={handleInputChange}
            className='min-h-[100px]'
          />
        </div>
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <Label htmlFor='modelCard'>Model Card *</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='link' size='sm' className='h-auto p-0'>
                  What is a Model Card?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About Model Cards</DialogTitle>
                  <DialogDescription>
                    Model cards provide structured information about AI models
                    to improve transparency and accountability.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <p className='text-sm'>
                    A good model card should include information about:
                  </p>
                  <ul className='list-disc pl-5 text-sm space-y-1'>
                    <li>Model details (architecture, version, etc.)</li>
                    <li>Intended use cases and limitations</li>
                    <li>Training data and methodology</li>
                    <li>Evaluation results and metrics</li>
                    <li>Ethical considerations and biases</li>
                    <li>Safety measures implemented</li>
                  </ul>
                  <p className='text-sm'>
                    Model cards help credential issuers evaluate your agent and
                    provide appropriate verifiable credentials.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant='outline'>Download Template</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className='border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center'>
            {uploadedModelCard ? (
              <div className='flex flex-col items-center gap-2'>
                <FileCheck className='h-8 w-8 text-primary' />
                <p className='text-sm font-medium'>{uploadedModelCard.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {Math.round(uploadedModelCard.size / 1024)} KB
                </p>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setUploadedModelCard(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className='flex flex-col items-center gap-2'>
                <Upload className='h-8 w-8 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  Upload your model card (PDF or Markdown)
                </p>
                <Input
                  id='modelCard'
                  type='file'
                  className='hidden'
                  accept='.pdf,.md'
                  onChange={handleModelCardUpload}
                />
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => document.getElementById('modelCard')?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <Label htmlFor='file-upload'>
              Supporting Documentation (Optional)
            </Label>
          </div>
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
                  Upload additional documentation (research papers, audit
                  reports, etc.)
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
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='outline' onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next Step <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </CardFooter>
    </Card>
  )
}
