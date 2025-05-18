import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { WalletConnect } from '@/components/wallet-connect'

export default function ConnectPage() {
  return (
    <div className='container py-8 md:py-12'>
      <div className='max-w-md mx-auto'>
        <div className='mb-8'>
          <Button variant='ghost' size='icon' asChild className='mb-4'>
            <Link href='/'>
              <ArrowLeft className='w-4 h-4' />
            </Link>
          </Button>
          <h1 className='text-3xl font-semibold tracking-tight'>
            <span className='px-3 py-1 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80'>
              Connect
            </span>
            &thinsp; DID Wallet
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Connect your Wallet to create your Decentralised Identifier.
          </p>
        </div>
        <WalletConnect />
      </div>
    </div>
  )
}
