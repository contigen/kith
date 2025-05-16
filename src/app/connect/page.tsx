'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus, ArrowLeft, Copy, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { WalletConnect } from '@/components/wallet-connect'

export default function ConnectPage() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletType, setWalletType] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [copied, setCopied] = useState(false)
  const [manualDid, setManualDid] = useState('')
  const [manualSignature, setManualSignature] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState(0)

  // Check if user already has a connected wallet
  useEffect(() => {
    // This would typically check local storage or a session
    const savedWallet = localStorage.getItem('connectedWallet')
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet)
        setWalletAddress(walletData.address)
        setWalletType(walletData.type)
        setIsConnected(true)
      } catch (e) {
        localStorage.removeItem('connectedWallet')
      }
    }
  }, [])

  // Simplified wallet connection process
  const connectWallet = (type: string) => {
    setWalletType(type)
    setIsConnecting(true)
    setConnectionProgress(0)

    // Simulate connection process with progress
    const interval = setInterval(() => {
      setConnectionProgress(prev => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)

          // Generate a random DID
          const randomDID = `did:cheqd:mainnet:z${Math.random()
            .toString(36)
            .substring(2, 15)}`
          setWalletAddress(randomDID)
          setIsConnecting(false)
          setIsConnected(true)

          // Save to local storage
          localStorage.setItem(
            'connectedWallet',
            JSON.stringify({
              type,
              address: randomDID,
            })
          )

          toast.success('Wallet Connected', {
            description: `Your ${type} has been successfully connected.`,
          })

          return 100
        }
        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletType('')
    setWalletAddress('')
    localStorage.removeItem('connectedWallet')

    toast.info('Wallet Disconnected', {
      description: 'Your DID wallet has been disconnected.',
    })
  }

  const copyToClipboard = () => {
    if (navigator.clipboard && walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast('DID Copied', {
        description: 'DID has been copied to clipboard.',
      })
    }
  }

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
            Connect your Decentralized Identifier to interact with the kith
            ecosystem
          </p>
        </div>

        {isConnected ? (
          <Card className='shadow-md border-primary/20'>
            <CardHeader className='bg-gradient-to-r from-primary/5 to-transparent'>
              <CardTitle>Wallet Connected</CardTitle>
              <CardDescription>
                Your DID wallet is connected and ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center gap-4'>
                <div className='flex items-center justify-center w-16 h-16 rounded-full bg-primary/10'>
                  <Avatar className='h-14 w-14'>
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      {walletType.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className='text-center'>
                  <h3 className='font-medium'>{walletType} Wallet</h3>
                  <Badge variant='outline' className='mt-1'>
                    Connected
                  </Badge>
                </div>

                <div className='w-full mt-2'>
                  <Label className='text-xs text-muted-foreground'>
                    Your DID
                  </Label>
                  <div className='flex items-center p-2 mt-1 text-sm rounded-md bg-muted'>
                    <span className='flex-1 truncate'>{walletAddress}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='w-8 h-8'
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className='w-4 h-4' />
                      ) : (
                        <Copy className='w-4 h-4' />
                      )}
                    </Button>
                  </div>
                </div>

                <div className='w-full mt-4 space-y-2'>
                  <Button className='w-full' asChild>
                    <Link href='/registry'>Explore Registry</Link>
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isConnecting ? (
          <Card>
            <CardHeader>
              <CardTitle>Connecting to {walletType}</CardTitle>
              <CardDescription>
                Please approve the connection request in your wallet
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col items-center justify-center py-6 space-y-6'>
              <div className='w-full h-2 overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full transition-all duration-300 ease-out bg-primary'
                  style={{ width: `${connectionProgress}%` }}
                ></div>
              </div>

              <div className='relative'>
                <div className='absolute inset-0 border-4 rounded-full border-primary/20 border-t-primary animate-spin'></div>
                <div className='flex items-center justify-center w-24 h-24 rounded-full bg-primary/10'>
                  <span className='text-lg font-semibold'>
                    {connectionProgress}%
                  </span>
                </div>
              </div>

              <p className='text-sm text-center text-muted-foreground'>
                {connectionProgress < 30 && 'Initializing connection...'}
                {connectionProgress >= 30 &&
                  connectionProgress < 60 &&
                  'Waiting for approval...'}
                {connectionProgress >= 60 &&
                  connectionProgress < 90 &&
                  'Verifying signature...'}
                {connectionProgress >= 90 && 'Finalizing connection...'}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => setIsConnecting(false)}
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>Connect your Leap wallet</CardDescription>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='grid grid-cols-2 gap-3'>
                <WalletConnect />
                <Button
                  variant='outline'
                  className='flex flex-col items-center justify-center h-auto py-4 hover:bg-primary/5 hover:border-primary/20'
                  onClick={() => connectWallet('Other')}
                >
                  <div className='flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-primary/10'>
                    <Plus className='w-5 h-5 text-primary' />
                  </div>
                  <span className='text-sm'>Other Wallet</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
