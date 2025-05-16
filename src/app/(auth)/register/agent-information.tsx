import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { ArrowRight, Upload, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dispatch, SetStateAction, useState } from 'react'
import { _FormData } from './type'
import { toast } from 'sonner'
import Image from 'next/image'
import { uploadImageToIPFS } from '@/actions'

export function AgentInformation({
  formData,
  setFormData,
  handleNext,
  handleInputChange,
}: {
  formData: _FormData
  setFormData: Dispatch<SetStateAction<_FormData>>
  handleNext: () => void
  handleInputChange(
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function readFile(file: File | undefined) {
    if (file && file.type.startsWith(`image/`)) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) setPreviewUrl(reader.result.toString())
      }
      reader.readAsDataURL(file)
    } else {
      toast.warning('Invalid File Type', {
        description: `Please upload a valid image file.`,
      })
    }
  }

  async function handleFileChange(
    evt: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    const file = evt.target.files?.[0]

    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }))
      readFile(file)
      const formData = new FormData()
      formData.append('file', file)
      const response = await uploadImageToIPFS(formData)
      setFormData(formData => ({
        ...formData,
        logoUrl: response.ipfsUrl || '',
      }))
    }
  }

  function handleSelectChange(name: string, value: string) {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide basic details about your AI agent
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Agent Name *</Label>
          <Input
            id='name'
            name='name'
            placeholder='e.g., GPT-4o Assistant'
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='creator'>Creator/Organization *</Label>
          <Input
            id='creator'
            name='creator'
            placeholder='e.g., OpenAI'
            value={formData.creator}
            onChange={handleInputChange}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Description *</Label>
          <Textarea
            id='description'
            name='description'
            placeholder="Describe your AI agent's purpose and functionality"
            value={formData.description}
            onChange={handleInputChange}
            className='min-h-[100px]'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='category'>Category</Label>
          <Select
            value={formData.category}
            onValueChange={value => handleSelectChange('category', value)}
          >
            <SelectTrigger id='category'>
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='general'>General Purpose</SelectItem>
              <SelectItem value='specialized'>Specialized</SelectItem>
              <SelectItem value='research'>Research</SelectItem>
              <SelectItem value='enterprise'>Enterprise</SelectItem>
              <SelectItem value='creative'>Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='website'>Website (Optional)</Label>
          <Input
            id='website'
            name='website'
            placeholder='https://example.com'
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='contactEmail'>Contact Email *</Label>
          <Input
            id='contactEmail'
            name='contactEmail'
            type='email'
            placeholder='contact@example.com'
            value={formData.contactEmail}
            onChange={handleInputChange}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='logo'>Agent Logo</Label>
          {previewUrl ? (
            <div className='flex flex-col items-center'>
              <Button
                variant='ghost'
                onClick={evt => {
                  evt.stopPropagation()
                  setPreviewUrl(null)
                }}
                className='rounded-xl'
              >
                <X className='size-4' />
              </Button>
              <p className='mb-2 font-medium'>Image Preview:</p>
              <Image
                src={previewUrl}
                alt='NFT Preview'
                width={80}
                height={80}
                className='max-w-full mx-auto rounded-lg shadow-md w-28 h-28 object-cover'
              />
              <p className='text-xs text-muted-foreground mt-2'>
                {(formData.logo as File).name}
              </p>
            </div>
          ) : (
            <div className='border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center'>
              <Upload className='h-6 w-6 text-muted-foreground mb-2' />
              <p className='text-sm text-muted-foreground'>
                Drag and drop or click to upload
              </p>
              <Input
                id='logo'
                type='file'
                className='hidden'
                accept='image/*'
                onChange={e => handleFileChange(e, 'logo')}
              />
              <Button
                variant='outline'
                size='sm'
                className='mt-2'
                onClick={() => document.getElementById('logo')?.click()}
              >
                Select Image
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button onClick={handleNext}>
          Next Step <ArrowRight className='ml-1 size-4' />
        </Button>
      </CardFooter>
    </Card>
  )
}
