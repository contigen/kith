'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Avatar, AvatarFallback } from './ui/avatar'
import { signIn } from 'next-auth/react'

interface Account {
  address: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offlineSigner: any
}
interface LeapWindow extends Window {
  leap?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getOfflineSigner: (chainId: string) => Promise<any>
    experimentalSuggestChain: (chainConfig: ChainConfig) => Promise<void>
  }
}

// Chain configuration types
interface Currency {
  coinDenom: string
  coinMinimalDenom: string
  coinDecimals: number
}

interface Bip44 {
  coinType: number
}

interface Bech32Config {
  bech32PrefixAccAddr: string
  bech32PrefixAccPub: string
  bech32PrefixValAddr: string
  bech32PrefixValPub: string
  bech32PrefixConsAddr: string
  bech32PrefixConsPub: string
}

interface GasPriceStep {
  low: number
  average: number
  high: number
}

interface ChainConfig {
  chainId: string
  chainName: string
  rpc: string
  rest: string
  bip44: Bip44
  bech32Config: Bech32Config
  currencies: Currency[]
  feeCurrencies: Currency[]
  stakeCurrency: Currency
  gasPriceStep: GasPriceStep
}

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const walletType = 'Leap Wallet'

  async function connectToLeapWallet() {
    try {
      setIsConnecting(true)

      const leapWindow = window as unknown as LeapWindow

      if (!leapWindow.leap) {
        toast.info('Leap Wallet extension not found. Please install it first.')
        setIsConnecting(false)
        return
      }

      const cheqdTestnetConfig: ChainConfig = {
        chainId: 'cheqd-testnet-4',
        chainName: 'cheqd Testnet',
        rpc: 'https://rpc.cheqd.testnet.com',
        rest: 'https://rest.cheqd.testnet.com',
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: 'cheqd',
          bech32PrefixAccPub: 'cheqdpub',
          bech32PrefixValAddr: 'cheqdvaloper',
          bech32PrefixValPub: 'cheqdvaloperpub',
          bech32PrefixConsAddr: 'cheqdvalcons',
          bech32PrefixConsPub: 'cheqdvalconspub',
        },
        currencies: [
          {
            coinDenom: 'CHEQ',
            coinMinimalDenom: 'ncheq',
            coinDecimals: 9,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: 'CHEQ',
            coinMinimalDenom: 'ncheq',
            coinDecimals: 9,
          },
        ],
        stakeCurrency: {
          coinDenom: 'CHEQ',
          coinMinimalDenom: 'ncheq',
          coinDecimals: 9,
        },
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04,
        },
      }

      try {
        await leapWindow.leap.experimentalSuggestChain(cheqdTestnetConfig)
      } catch (suggestError) {
        console.warn('Chain may already exist:', suggestError)
      }

      const offlineSigner = await leapWindow.leap.getOfflineSigner(
        cheqdTestnetConfig.chainId
      )

      const accounts = await offlineSigner.getAccounts()

      if (accounts && accounts.length > 0) {
        const connectedAccount: Account = {
          address: accounts[0].address,
          offlineSigner: offlineSigner,
        }
        const { address } = connectedAccount
        setWalletAddress(address)
        setIsConnected(true)
        await signIn('credentials', {
          walletAddress: address,
        })
        toast.success('Connected to Leap Wallet')
      } else {
        throw new Error('No accounts found')
      }
    } catch {
      toast.error('Failed to connect to Leap Wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div>
      {isConnected ? (
        <Card className='shadow-md border-primary/20 overflow-hidden'>
          <CardHeader className='bg-gradient-to-r from-primary/10 to-transparent'>
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
                    {'cheqd'.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className='text-center'>
                <h3 className='font-medium'>{walletType}</h3>
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
                </div>
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
              <div className='h-full transition-all duration-300 ease-out bg-primary' />
            </div>

            <div className='relative'>
              <div className='absolute inset-0 border-4 rounded-full border-primary/20 border-t-primary animate-spin'></div>
              <div className='flex items-center justify-center w-24 h-24 rounded-full bg-primary/10'>
                <span className='text-2xl font-bold font-pixel'>0x</span>
              </div>
            </div>
            <p className='text-sm text-center text-muted-foreground'>
              Waiting for approval...
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
            <div className='mx-auto w-fit'>
              <Button
                onClick={connectToLeapWallet}
                disabled={isConnecting}
                variant='outline'
                className='flex items-center gap-2 px-4 py-2 font-medium transition-colors duration-200 rounded-lg border-dashed border-primary text-primary hover:border-black'
              >
                {isConnecting ? 'Connecting...' : 'Connect Leap Wallet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
