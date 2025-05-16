import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { VerifiableCredentialBadge } from '@/components/verifiable-credential-badge'
import { AgentTimeline } from '@/components/agent-timeline'
import { CredentialViewer } from '@/components/credential-viewer'
import { ArrowLeft, ExternalLink, Flag, Upload, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Image from 'next/image'
import { findAgent } from '@/lib/db-queries'
import { redirect } from 'next/navigation'

// Mock data for a single agent
const agent = {
  id: '1',
  name: 'GPT-4o Assistant',
  creator: 'OpenAI',
  did: 'did:cheqd:mainnet:zABCDEF123456789',
  logo: '/placeholder.svg?height=128&width=128',
  trustScore: 95,
  description:
    "GPT-4o is OpenAI's most advanced multimodal model that can process text, audio, and images. It has been verified for safety, capabilities, and creator authenticity.",
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
  auditReports: [
    {
      title: 'Safety Audit Report',
      issuer: 'AI Safety Institute',
      date: '2023-03-20T14:45:00Z',
      url: '#',
    },
    {
      title: 'Capability Assessment',
      issuer: 'OpenAI',
      date: '2023-03-25T09:15:00Z',
      url: '#',
    },
  ],
  timeline: [
    {
      event: 'Creator Credential Issued',
      date: '2023-03-15T10:30:00Z',
      issuer: 'OpenAI',
    },
    {
      event: 'Safety Audit Completed',
      date: '2023-03-20T14:45:00Z',
      issuer: 'AI Safety Institute',
    },
    {
      event: 'Capability Credential Issued',
      date: '2023-03-25T09:15:00Z',
      issuer: 'OpenAI',
    },
    {
      event: 'Model Card Updated',
      date: '2023-04-05T11:20:00Z',
      issuer: 'OpenAI',
    },
  ],
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agent = await findAgent(id)
  if (!agent) redirect('/register')
  return (
    <div className='container py-8 md:py-12'>
      <div className='flex flex-col gap-8'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' asChild>
            <Link href='/registry'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <h1 className='text-2xl font-bold tracking-tighter'>Agent Profile</h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='md:col-span-1'>
            <CardContent className='p-6'>
              <div className='flex flex-col items-center gap-4 text-center'>
                <Image
                  src={agent.logo || '/placeholder.svg'}
                  width={128}
                  height={128}
                  alt={agent.name}
                  className='rounded-md object-cover'
                />
                <div>
                  <h2 className='text-xl font-bold'>{agent.name}</h2>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Created by {agent.creator}
                  </p>
                </div>
                <div className='flex flex-col items-center gap-2'>
                  <TrustScoreBadge score={agent.trustScore} size='lg' />
                  <p className='text-sm font-medium'>Trust Score</p>
                </div>
                <div className='w-full pt-4 border-t'>
                  <p className='text-sm text-muted-foreground'>
                    {agent.description}
                  </p>
                </div>
                <div className='w-full pt-4 border-t'>
                  <p className='text-sm font-medium mb-2'>DID</p>
                  <p className='text-xs text-muted-foreground break-all'>
                    {agent.did}
                  </p>
                </div>
                <div className='w-full flex flex-col gap-2'>
                  <Button asChild>
                    <Link href={`/verify?did=${agent.did}`}>
                      Verify This Agent
                    </Link>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline'>
                        <Flag className='mr-2 h-4 w-4' />
                        Flag Concerns
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report Concerns</DialogTitle>
                        <DialogDescription>
                          Report any concerns or issues with this AI agent. Your
                          report will be reviewed by our team.
                        </DialogDescription>
                      </DialogHeader>
                      <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='concern-type'>Concern Type</Label>
                          <Select>
                            <SelectTrigger id='concern-type'>
                              <SelectValue placeholder='Select concern type' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='safety'>
                                Safety Issue
                              </SelectItem>
                              <SelectItem value='performance'>
                                Performance Issue
                              </SelectItem>
                              <SelectItem value='ethics'>
                                Ethical Concern
                              </SelectItem>
                              <SelectItem value='misrepresentation'>
                                Misrepresentation
                              </SelectItem>
                              <SelectItem value='other'>Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='description'>Description</Label>
                          <Textarea
                            id='description'
                            placeholder='Please describe your concern in detail...'
                            className='min-h-[100px]'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='evidence'>Evidence (Optional)</Label>
                          <div className='border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center'>
                            <Upload className='h-6 w-6 text-muted-foreground mb-2' />
                            <p className='text-sm text-muted-foreground'>
                              Drag and drop or click to upload
                            </p>
                            <Input
                              id='evidence'
                              type='file'
                              className='hidden'
                            />
                            <Button
                              variant='outline'
                              size='sm'
                              className='mt-2'
                              onClick={() =>
                                document.getElementById('evidence')?.click()
                              }
                            >
                              Select File
                            </Button>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='contact'>
                            Contact Email (Optional)
                          </Label>
                          <Input
                            id='contact'
                            type='email'
                            placeholder='your@email.com'
                          />
                          <p className='text-xs text-muted-foreground'>
                            We&apos;ll only contact you if we need more
                            information.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant='outline' className='mr-2'>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            toast('Report Submitted', {
                              description:
                                "Thank you for your report. We'll review it shortly.",
                            })
                          }}
                        >
                          Submit Report
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='md:col-span-2'>
            <Tabs defaultValue='overview'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='credentials'>Credentials</TabsTrigger>
                <TabsTrigger value='audits'>Audit Reports</TabsTrigger>
                <TabsTrigger value='activity'>Activity Log</TabsTrigger>
              </TabsList>
              <TabsContent value='overview' className='mt-4'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='space-y-6'>
                      <div>
                        <h3 className='text-lg font-medium mb-2'>
                          Credentials Summary
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {agent.credentials.map(credential => (
                            <VerifiableCredentialBadge
                              key={credential.type}
                              type={credential.type}
                              verified={credential.verified}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-medium mb-2'>
                          Recent Activity
                        </h3>
                        <AgentTimeline
                          timeline={agent.timelineEvents.slice(0, 3)}
                        />
                      </div>
                      <div>
                        <h3 className='text-lg font-medium mb-2'>Model Card</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant='outline'>
                              <ExternalLink className='mr-2 h-4 w-4' />
                              View Model Card
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
                            <DialogHeader>
                              <DialogTitle>
                                Model Card: {agent.name}
                              </DialogTitle>
                              <DialogDescription>
                                Detailed information about this AI agent's
                                capabilities and limitations
                              </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4 py-4'>
                              <div className='space-y-2'>
                                <h4 className='text-sm font-medium'>
                                  Model Overview
                                </h4>
                                <p className='text-sm text-muted-foreground'>
                                  {agent.name} is a multimodal large language
                                  model developed by {agent.creator}. It can
                                  process and generate text, images, and audio,
                                  and can be used for a wide range of tasks
                                  including content creation, summarization, and
                                  conversational AI.
                                </p>
                              </div>
                              <div className='space-y-2'>
                                <h4 className='text-sm font-medium'>
                                  Capabilities
                                </h4>
                                <ul className='text-sm text-muted-foreground list-disc pl-5 space-y-1'>
                                  <li>
                                    Natural language understanding and
                                    generation
                                  </li>
                                  <li>Image recognition and generation</li>
                                  <li>Audio processing and transcription</li>
                                  <li>Code understanding and generation</li>
                                  <li>Multilingual support (40+ languages)</li>
                                </ul>
                              </div>
                              <div className='space-y-2'>
                                <h4 className='text-sm font-medium'>
                                  Limitations
                                </h4>
                                <ul className='text-sm text-muted-foreground list-disc pl-5 space-y-1'>
                                  <li>
                                    May occasionally generate incorrect
                                    information
                                  </li>
                                  <li>
                                    Limited knowledge of events after training
                                    cutoff
                                  </li>
                                  <li>
                                    May not always understand cultural nuances
                                  </li>
                                  <li>
                                    Performance varies across different
                                    languages
                                  </li>
                                </ul>
                              </div>
                              <div className='space-y-2'>
                                <h4 className='text-sm font-medium'>
                                  Safety Considerations
                                </h4>
                                <p className='text-sm text-muted-foreground'>
                                  This model has undergone safety testing and
                                  has been fine-tuned to refuse harmful,
                                  illegal, unethical, or deceptive requests. It
                                  includes content filtering systems and has
                                  been evaluated for potential biases.
                                </p>
                              </div>
                              <div className='space-y-2'>
                                <h4 className='text-sm font-medium'>
                                  Training Data
                                </h4>
                                <p className='text-sm text-muted-foreground'>
                                  Trained on a diverse dataset of text, code,
                                  and images from various public sources. The
                                  training data was filtered to remove
                                  personally identifiable information and
                                  harmful content.
                                </p>
                              </div>
                              <div className='space-y-2'>
                                <h4 className='text-sm font-medium'>
                                  Evaluation Results
                                </h4>
                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='p-3 border rounded-md'>
                                    <h5 className='text-xs font-medium mb-1'>
                                      MMLU Score
                                    </h5>
                                    <p className='text-sm'>86.2%</p>
                                  </div>
                                  <div className='p-3 border rounded-md'>
                                    <h5 className='text-xs font-medium mb-1'>
                                      HumanEval
                                    </h5>
                                    <p className='text-sm'>78.9%</p>
                                  </div>
                                  <div className='p-3 border rounded-md'>
                                    <h5 className='text-xs font-medium mb-1'>
                                      GSM8K
                                    </h5>
                                    <p className='text-sm'>92.4%</p>
                                  </div>
                                  <div className='p-3 border rounded-md'>
                                    <h5 className='text-xs font-medium mb-1'>
                                      TruthfulQA
                                    </h5>
                                    <p className='text-sm'>89.7%</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant='outline' asChild>
                                <a href='#' download='model-card-gpt4o.pdf'>
                                  <Download className='mr-2 h-4 w-4' />
                                  Download PDF
                                </a>
                              </Button>
                              <DialogClose asChild>
                                <Button>Close</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value='credentials' className='mt-4'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='space-y-6'>
                      {agent.credentials.map(credential => (
                        <div
                          key={credential.type}
                          className='p-4 border rounded-lg'
                        >
                          <div className='flex justify-between items-start mb-4'>
                            <div>
                              <h3 className='text-lg font-medium'>
                                {credential.type} Credential
                              </h3>
                              <p className='text-sm text-muted-foreground'>
                                Issued by {'Kith'} on{' '}
                                {new Date(
                                  credential.issuedDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                credential.verified ? 'default' : 'outline'
                              }
                            >
                              {credential.verified
                                ? 'Verified'
                                : 'Not Verified'}
                            </Badge>
                          </div>
                          <CredentialViewer
                            type={credential.type}
                            issuer={'Kith'}
                            issuedDate={credential.createdAt.toLocaleDateString()}
                            subject={agent.did}
                          />
                          <div className='flex justify-end mt-4'>
                            <Button variant='outline' size='sm'>
                              <Download className='mr-2 h-3 w-3' />
                              Download VC
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value='audits' className='mt-4'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='space-y-6'>
                      {agent.auditReports.map((report, idx) => (
                        <div
                          key={report.title}
                          className='p-4 border rounded-lg'
                        >
                          <div className='flex justify-between items-start mb-4'>
                            <div>
                              <h3 className='text-lg font-medium'>
                                {report.title}
                              </h3>
                              <p className='text-sm text-muted-foreground'>
                                Issued by {'Kith'} on{' '}
                                {new Date(report.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant='outline'>
                              {idx === 0 ? 'Latest' : 'Previous'}
                            </Badge>
                          </div>
                          <div className='bg-muted p-4 rounded-md space-y-4'>
                            <div>
                              <h4 className='text-sm font-medium mb-1'>
                                Executive Summary
                              </h4>
                              <p className='text-sm text-muted-foreground'>
                                {idx === 0
                                  ? 'This audit evaluated the safety and capability claims of GPT-4o. The model demonstrates strong performance across evaluated dimensions with some minor areas for improvement noted.'
                                  : "Assessment of GPT-4o's capabilities against industry benchmarks. The model performs well on most tasks with some limitations in specialized domains."}
                              </p>
                            </div>
                            <div>
                              <h4 className='text-sm font-medium mb-1'>
                                Key Findings
                              </h4>
                              <ul className='text-sm text-muted-foreground list-disc pl-5 space-y-1'>
                                {idx === 0 ? (
                                  <>
                                    <li>
                                      Safety systems effectively prevent most
                                      harmful outputs
                                    </li>
                                    <li>
                                      Performance on factual accuracy benchmarks
                                      exceeds 92%
                                    </li>
                                    <li>
                                      Multimodal capabilities meet or exceed
                                      claimed specifications
                                    </li>
                                    <li>
                                      Minor vulnerabilities identified in edge
                                      case handling
                                    </li>
                                  </>
                                ) : (
                                  <>
                                    <li>
                                      Capability claims are accurately
                                      represented
                                    </li>
                                    <li>
                                      Model performs within expected parameters
                                      on standard benchmarks
                                    </li>
                                    <li>
                                      Response time and throughput meet industry
                                      standards
                                    </li>
                                    <li>
                                      Some limitations in specialized knowledge
                                      domains
                                    </li>
                                  </>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className='text-sm font-medium mb-1'>
                                Methodology
                              </h4>
                              <p className='text-sm text-muted-foreground'>
                                {idx === 0
                                  ? 'Comprehensive testing using standardized benchmarks, adversarial testing, and real-world use case simulations across 1,200+ test cases.'
                                  : 'Performance evaluation across 15 standard benchmarks and 8 specialized capability tests with comparative analysis against similar models.'}
                              </p>
                            </div>
                            <div className='pt-2 text-center'>
                              <p className='text-xs text-muted-foreground'>
                                This is a preview. View the full report for
                                complete details.
                              </p>
                            </div>
                          </div>
                          <div className='flex justify-between mt-4'>
                            <Button variant='outline' size='sm'>
                              <Download className='mr-2 h-3 w-3' />
                              Download PDF
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size='sm'>
                                  <ExternalLink className='mr-2 h-3 w-3' />
                                  View Full Report
                                </Button>
                              </DialogTrigger>
                              <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
                                <DialogHeader>
                                  <DialogTitle>{report.title}</DialogTitle>
                                  <DialogDescription>
                                    Issued by {'Kith'} on{' '}
                                    {new Date(report.date).toLocaleDateString()}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className='space-y-6 py-4'>
                                  <div className='space-y-2'>
                                    <h3 className='text-lg font-medium'>
                                      Executive Summary
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                      {idx === 0
                                        ? 'This comprehensive audit evaluated the safety mechanisms, capability claims, and performance characteristics of GPT-4o. The model demonstrates strong performance across all evaluated dimensions with some minor areas for improvement noted in specific edge cases. Overall, the model meets or exceeds the safety and capability standards required for public deployment.'
                                        : "This assessment evaluated GPT-4o's capabilities against industry benchmarks and the model's stated specifications. The model performs well on most general and specialized tasks with some limitations in highly specialized domains. The capabilities claimed by OpenAI are accurately represented, and the model's performance is consistent with its documentation."}
                                    </p>
                                  </div>

                                  <div className='space-y-2'>
                                    <h3 className='text-lg font-medium'>
                                      Methodology
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                      {idx === 0
                                        ? 'Our audit methodology combined standardized benchmarks, adversarial testing protocols, and real-world use case simulations. We conducted over 1,200 test cases across various domains including content safety, factual accuracy, bias evaluation, and capability verification. The testing was performed by a team of 12 specialists over a period of 4 weeks.'
                                        : 'We evaluated the model across 15 standard benchmarks including MMLU, HumanEval, GSM8K, and TruthfulQA, as well as 8 specialized capability tests designed to assess multimodal understanding, code generation, and reasoning abilities. We also conducted comparative analysis against similar models in the market.'}
                                    </p>
                                  </div>

                                  <div className='space-y-2'>
                                    <h3 className='text-lg font-medium'>
                                      Key Findings
                                    </h3>
                                    <div className='space-y-4'>
                                      <div>
                                        <h4 className='text-sm font-medium'>
                                          Safety Evaluation
                                        </h4>
                                        <p className='text-sm text-muted-foreground'>
                                          {idx === 0
                                            ? "The model's safety systems effectively prevent most harmful outputs across tested categories. Refusal rates for explicitly harmful requests exceed 99.2%. Edge case handling shows 96.7% effectiveness with some vulnerabilities in complex, implicit harmful requests."
                                            : 'The model appropriately handles safety-critical requests with a refusal rate of 98.5% for harmful content generation. Safety mechanisms are well-integrated and do not significantly impact performance on legitimate tasks.'}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className='text-sm font-medium'>
                                          Capability Assessment
                                        </h4>
                                        <p className='text-sm text-muted-foreground'>
                                          {idx === 0
                                            ? 'GPT-4o demonstrates strong performance across all tested capabilities. Factual accuracy benchmarks show 92.4% correctness. Multimodal capabilities meet or exceed claimed specifications with particularly strong performance in image understanding (94.7% accuracy) and code generation (78.9% pass rate on HumanEval).'
                                            : 'The model performs within expected parameters on standard benchmarks with notable strengths in reasoning (92.4% on GSM8K) and knowledge retrieval (86.2% on MMLU). Response quality is consistent across varied inputs with some limitations in highly specialized domains like advanced physics and certain programming languages.'}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className='text-sm font-medium'>
                                          Bias and Fairness
                                        </h4>
                                        <p className='text-sm text-muted-foreground'>
                                          {idx === 0
                                            ? 'Evaluation across demographic categories shows improved fairness compared to previous models. Representation biases are reduced but not eliminated. The model shows a 76% reduction in stereotypical associations compared to baseline models.'
                                            : 'The model demonstrates relatively balanced performance across demographic groups with some remaining disparities in specialized knowledge domains. Cultural references and understanding show improvements but with continued Western-centric tendencies.'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className='space-y-2'>
                                    <h3 className='text-lg font-medium'>
                                      Recommendations
                                    </h3>
                                    <ul className='text-sm text-muted-foreground list-disc pl-5 space-y-1'>
                                      {idx === 0 ? (
                                        <>
                                          <li>
                                            Strengthen edge case handling for
                                            implicit harmful requests
                                          </li>
                                          <li>
                                            Improve factual accuracy in
                                            specialized scientific domains
                                          </li>
                                          <li>
                                            Continue efforts to reduce
                                            representation biases
                                          </li>
                                          <li>
                                            Enhance documentation of model
                                            limitations
                                          </li>
                                          <li>
                                            Implement additional monitoring for
                                            emerging misuse patterns
                                          </li>
                                        </>
                                      ) : (
                                        <>
                                          <li>
                                            Provide more detailed documentation
                                            on performance variations across
                                            domains
                                          </li>
                                          <li>
                                            Consider specialized fine-tuning for
                                            underperforming knowledge areas
                                          </li>
                                          <li>
                                            Improve transparency around training
                                            data composition
                                          </li>
                                          <li>
                                            Develop more robust evaluation
                                            metrics for multimodal capabilities
                                          </li>
                                        </>
                                      )}
                                    </ul>
                                  </div>

                                  <div className='space-y-2'>
                                    <h3 className='text-lg font-medium'>
                                      Conclusion
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                      {idx === 0
                                        ? 'GPT-4o meets the safety and capability standards required for public deployment. The identified areas for improvement should be addressed in future updates, but do not present significant barriers to responsible use. We recommend ongoing monitoring and regular re-evaluation as usage patterns evolve.'
                                        : "The capabilities claimed by OpenAI for GPT-4o are accurately represented, and the model's performance is consistent with its documentation. The model represents a meaningful advancement in multimodal AI capabilities while maintaining appropriate safety guardrails."}
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant='outline' asChild>
                                    <a
                                      href='#'
                                      download={`audit-report-${idx}.pdf`}
                                    >
                                      <Download className='mr-2 h-4 w-4' />
                                      Download Full Report
                                    </a>
                                  </Button>
                                  <DialogClose asChild>
                                    <Button>Close</Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value='activity' className='mt-4'>
                <Card>
                  <CardContent className='p-6'>
                    <AgentTimeline timeline={agent.timelineEvents} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
