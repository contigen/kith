'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrustScoreBadge } from '@/components/trust-score-badge'
import { VerifiableCredentialBadge } from '@/components/verifiable-credential-badge'
import { Search, Download, Share2 } from 'lucide-react'
import { verifyCredentialAction } from '@/actions'
import { VerifiableCredential } from '@/types'
import { Agent } from '@/lib/db-queries'

export default function VerifyPage() {
  const [did, setDid] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<Agent | null>(
    null
  )
  const [verifiedCredential, setVerifiedCredential] =
    useState<VerifiableCredential | null>(null)

  const handleVerify = async () => {
    setIsVerifying(true)
    const { agent, verifiedCredential } = await verifyCredentialAction(did)
    setVerificationResult(agent as Agent)
    setVerifiedCredential(verifiedCredential)
    setIsVerifying(false)
  }

  return (
    <div className='container py-8 md:py-12'>
      <div className='flex flex-col gap-8 max-w-2xl mx-auto'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold tracking-tighter'>
            Verify AI Agent
          </h1>
          <p className='text-muted-foreground mt-2'>
            Enter an AI agent&apos;s DID
          </p>
        </div>

        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Enter DID (did:cheqd:...)'
                  value={did}
                  onChange={e => setDid(e.target.value)}
                  className='flex-1'
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                pending={isVerifying}
              >
                <Search className='mr-2 size-4' />
                Verify Agent
              </Button>
            </div>
          </CardContent>
        </Card>

        {verificationResult && (
          <Card>
            <CardContent className='p-6'>
              <div className='flex flex-col gap-6'>
                <div className='flex items-center gap-4'>
                  <img
                    src={verificationResult.logo || '/placeholder.svg'}
                    alt={verificationResult.name}
                    className='h-20 w-20 rounded-md object-cover'
                  />
                  <div>
                    <h2 className='text-xl font-bold'>
                      {verificationResult.name}
                    </h2>
                    <p className='text-sm text-muted-foreground'>
                      Created by {verificationResult.creator}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {verificationResult.did}
                    </p>
                  </div>
                  <div className='ml-auto'>
                    <TrustScoreBadge score={verificationResult.trustScore} />
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-medium mb-4'>Trust Status</h3>
                  <div className='space-y-4'>
                    {verificationResult.credentials.map((credential: any) => (
                      <div
                        key={credential.type}
                        className='flex items-center justify-between p-3 border rounded-md'
                      >
                        <div className='flex items-center gap-2'>
                          <VerifiableCredentialBadge
                            type={credential.type}
                            verified={credential.verified}
                          />
                          <span className='text-sm'>
                            {credential.type} Verification
                          </span>
                        </div>
                        <Badge
                          variant={credential.verified ? 'default' : 'outline'}
                        >
                          {credential.verified ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-2 pt-4 border-t'>
                  <Button variant='outline' className='flex-1'>
                    <Download className='mr-2 h-4 w-4' />
                    Download Credentials
                  </Button>
                  <Button className='flex-1'>
                    <Share2 className='mr-2 h-4 w-4' />
                    Share Proof Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {verifiedCredential && (
        <div className='bg-muted rounded-3xl py-4 px-8 my-8'>
          <pre className='max-w-full text-wrap break-all'></pre>
        </div>
      )}
    </div>
  )
}
