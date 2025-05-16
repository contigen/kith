import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, FileCheck, User } from 'lucide-react'
import { TrustedIssuersCarousel } from '@/components/trusted-issuers-carousel'
import { StatsSection } from '@/components/stats-section'

export default async function Home() {
  return (
    <div className='flex flex-col gap-16 pb-16'>
      {/* Hero Section */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center gap-4 text-center'>
            <Badge className='px-3.5 py-1.5' variant='secondary'>
              Decentralised Trust Layer
            </Badge>
            <h1 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl'>
              AI Agent Passport
            </h1>
            <p className='max-w-[700px] text-muted-foreground md:text-xl'>
              Verify the identity, capabilities, and safety of AI agents using
              Verifiable Credentials, DIDs, and Decentralized Linked Resources.
            </p>
            <div className='flex flex-col gap-4 mt-4 sm:flex-row'>
              <Button asChild size='lg'>
                <Link href='/registry'>
                  Explore Registry <ArrowRight className='w-4 h-4 ml-2' />
                </Link>
              </Button>
              <Button variant='outline' size='lg' asChild>
                <Link href='/verify'>Verify an Agent</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Roles Section */}
      <section className='container px-4 md:px-6'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl'>
            Key Roles in the Ecosystem
          </h2>
          <p className='max-w-[700px] text-muted-foreground'>
            kith connects trusted organizations, agent owners, and verifiers in
            a decentralized trust network.
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 mt-8 md:grid-cols-3'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <div className='p-2 rounded-full bg-primary/10'>
                  <User className='w-6 h-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Agent Owner</h3>
                <p className='text-sm text-muted-foreground'>
                  The entity deploying the AI agent, responsible for maintaining
                  its credentials.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <div className='p-2 rounded-full bg-primary/10'>
                  <FileCheck className='w-6 h-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Issuer</h3>
                <p className='text-sm text-muted-foreground'>
                  Trusted organizations that issue credentials such as auditors
                  and agent creators.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <div className='p-2 rounded-full bg-primary/10'>
                  <Shield className='w-6 h-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Verifier</h3>
                <p className='text-sm text-muted-foreground'>
                  Anyone checking the trust status of an agent, such as users,
                  platforms, or registries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trusted Issuers Carousel */}
      <section className='container px-4 md:px-6'>
        <div className='flex flex-col items-center gap-4 mb-8 text-center'>
          <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl'>
            Trusted Issuers
          </h2>
          <p className='max-w-[700px] text-muted-foreground'>
            Organizations that verify and issue credentials for AI agents.
          </p>
        </div>
        <TrustedIssuersCarousel />
      </section>

      {/* Stats Section */}
      <section className='container px-4 md:px-6'>
        <StatsSection />
      </section>
    </div>
  )
}
