'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { InfoIcon, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { VerifiableCredentialBadge } from '@/components/verifiable-credential-badge'

type TrustScoreCalculatorProps = {
  initialCredentials?: {
    type: string
    verified: boolean
    weight: number
  }[]
  initialFactors?: {
    name: string
    score: number
    weight: number
    description: string
  }[]
  readOnly?: boolean
  onScoreChange?: (score: number) => void
}

export function TrustScoreCalculator({
  initialCredentials = [
    { type: 'Creator', verified: true, weight: 30 },
    { type: 'Safety', verified: false, weight: 40 },
    { type: 'Capability', verified: false, weight: 30 },
  ],
  initialFactors = [
    {
      name: 'Credential Verification',
      score: 0, // This will be calculated
      weight: 70,
      description: 'Based on verified credentials from trusted issuers',
    },
    {
      name: 'Historical Performance',
      score: 65,
      weight: 15,
      description: 'Based on past behavior and reported issues',
    },
    {
      name: 'Transparency',
      score: 80,
      weight: 15,
      description: 'Based on provided documentation and disclosures',
    },
  ],
  readOnly = false,
  onScoreChange,
}: TrustScoreCalculatorProps) {
  // Initialize credentials state
  const [credentials, setCredentials] = useState(initialCredentials)

  // Initialize other factors
  const [factors, setFactors] = useState(initialFactors)

  // Calculate credential score
  const credentialScore = credentials.reduce((total, cred) => {
    return total + (cred.verified ? cred.weight : 0)
  }, 0)

  // Update the credential factor score and calculate trust score
  const updatedFactors = [...factors]
  const credentialFactorIndex = factors.findIndex(
    f => f.name === 'Credential Verification'
  )

  if (credentialFactorIndex >= 0) {
    updatedFactors[credentialFactorIndex] = {
      ...factors[credentialFactorIndex],
      score: credentialScore,
    }
  }

  // Calculate overall trust score
  const trustScore = Math.round(
    updatedFactors.reduce((total, factor) => {
      return total + (factor.score * factor.weight) / 100
    }, 0)
  )

  // Use useEffect to notify parent component about score changes
  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(trustScore)
    }
  }, [trustScore, onScoreChange])

  // Function to update a factor's score
  const updateFactorScore = (index: number, newScore: number) => {
    if (readOnly) return

    const newFactors = [...factors]
    newFactors[index] = {
      ...newFactors[index],
      score: newScore,
    }
    setFactors(newFactors)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>Trust Score Calculator</span>
          <TrustScoreBadge score={trustScore} size='lg' />
        </CardTitle>
        <CardDescription>
          Trust scores are calculated based on verified credentials and other
          trust factors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='overview'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='credentials'>Credentials</TabsTrigger>
            <TabsTrigger value='factors'>Other Factors</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4 pt-4'>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm font-medium'>
                <span>Overall Trust Score</span>
                <span>{trustScore}%</span>
              </div>
              <Progress value={trustScore} className='h-2' />
              <p className='text-sm text-muted-foreground'>
                {trustScore >= 90
                  ? 'Excellent trust score. This agent has comprehensive verification.'
                  : trustScore >= 70
                  ? 'Good trust score. This agent has substantial verification.'
                  : trustScore >= 50
                  ? 'Moderate trust score. Consider obtaining additional credentials.'
                  : 'Low trust score. Additional verification is strongly recommended.'}
              </p>
            </div>

            <div className='space-y-3'>
              <h4 className='text-sm font-medium'>Score Breakdown</h4>
              {updatedFactors.map(factor => (
                <div key={factor.name} className='space-y-1'>
                  <div className='flex justify-between text-sm'>
                    <div className='flex items-center gap-1'>
                      <span>{factor.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className='h-3 w-3 text-muted-foreground' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='max-w-xs'>{factor.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {factor.weight}% weight
                      </Badge>
                      <span>{factor.score}%</span>
                    </div>
                  </div>
                  <Progress value={factor.score} className='h-1.5' />
                </div>
              ))}
            </div>

            <div className='rounded-md bg-muted p-3'>
              <div className='flex items-start gap-3'>
                <Shield className='h-5 w-5 text-primary mt-0.5' />
                <div>
                  <h4 className='text-sm font-medium'>How Trust Scores Work</h4>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Trust scores are calculated based on verified credentials
                    from trusted issuers and other factors like historical
                    performance and transparency. Higher scores indicate more
                    thorough verification and lower risk.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='credentials' className='space-y-4 pt-4'>
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>
                Credential Verification Status
              </h4>
              <p className='text-sm text-muted-foreground'>
                Verified credentials from trusted issuers significantly impact
                the trust score
              </p>
            </div>

            <div className='space-y-4'>
              {credentials.map((credential, index) => (
                <div
                  key={credential.type}
                  className='flex items-center justify-between p-3 border rounded-md'
                >
                  <div className='flex items-center gap-3'>
                    <VerifiableCredentialBadge
                      type={credential.type}
                      verified={credential.verified}
                    />
                    <div>
                      <p className='text-sm font-medium'>
                        {credential.type} Credential
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {credential.weight}% of credential score
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    {credential.verified ? (
                      <div className='flex items-center text-green-600'>
                        <CheckCircle2 className='h-4 w-4 mr-1' />
                        <span className='text-sm'>Verified</span>
                      </div>
                    ) : (
                      <div className='flex items-center text-amber-600'>
                        <AlertTriangle className='h-4 w-4 mr-1' />
                        <span className='text-sm'>Not Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='pt-2'>
              <div className='flex justify-between text-sm font-medium'>
                <span>Credential Score</span>
                <span>{credentialScore}%</span>
              </div>
              <Progress value={credentialScore} className='h-2 mt-2' />
              <p className='text-sm text-muted-foreground mt-2'>
                {credentialScore === 100
                  ? 'All credentials verified. Maximum credential score achieved.'
                  : credentialScore >= 50
                  ? 'Some credentials verified. Request verification for remaining credentials to improve score.'
                  : 'Few or no credentials verified. Request verification to significantly improve trust score.'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value='factors' className='space-y-4 pt-4'>
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>Additional Trust Factors</h4>
              <p className='text-sm text-muted-foreground'>
                These factors contribute to the overall trust score alongside
                credentials
              </p>
            </div>

            {factors
              .filter(f => f.name !== 'Credential Verification')
              .map((factor, index) => {
                const actualIndex = factors.findIndex(
                  f => f.name === factor.name
                )
                return (
                  <div
                    key={factor.name}
                    className='space-y-2 p-3 border rounded-md'
                  >
                    <div className='flex justify-between'>
                      <div>
                        <h4 className='text-sm font-medium'>{factor.name}</h4>
                        <p className='text-xs text-muted-foreground'>
                          {factor.description}
                        </p>
                      </div>
                      <Badge variant='outline'>{factor.weight}% weight</Badge>
                    </div>

                    <div className='flex items-center gap-2'>
                      <span className='text-sm'>{factor.score}%</span>
                      {!readOnly && (
                        <Slider
                          value={[factor.score]}
                          min={0}
                          max={100}
                          step={1}
                          className='flex-1'
                          onValueChange={value =>
                            updateFactorScore(actualIndex, value[0])
                          }
                        />
                      )}
                    </div>

                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <InfoIcon className='h-3 w-3' />
                      {factor.name === 'Historical Performance'
                        ? 'Based on past behavior, reported issues, and community feedback'
                        : factor.name === 'Transparency'
                        ? 'Based on documentation quality, disclosures, and information provided'
                        : 'This factor is evaluated by the platform'}
                    </div>
                  </div>
                )
              })}

            {!readOnly && (
              <div className='rounded-md bg-muted p-3'>
                <div className='flex items-start gap-3'>
                  <InfoIcon className='h-5 w-5 text-primary mt-0.5' />
                  <div>
                    <h4 className='text-sm font-medium'>Issuer Controls</h4>
                    <p className='text-sm text-muted-foreground mt-1'>
                      As an issuer, you can adjust these factors based on your
                      evaluation. These adjustments will affect the agent&apos;s
                      overall trust score.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      {!readOnly && (
        <CardFooter className='flex justify-between'>
          <Button variant='outline'>Reset to Default</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  )
}
