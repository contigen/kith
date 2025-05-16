'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

interface Account {
  address: string
  offlineSigner: any // Using any for now, could be refined based on Leap types
}

// Define interface for the Leap wallet window extension
interface LeapWindow extends Window {
  leap?: {
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
  // Define types for our component

  const [isConnecting, setIsConnecting] = useState<boolean>(false)
  const [account, setAccount] = useState<Account | null>(null)

  async function connectToLeapWallet(): Promise<void> {
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

        setAccount(connectedAccount)
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

  function disconnectWallet(): void {
    setAccount(null)
  }

  // Format address for display (first 6 and last 4 characters)
  function formatAddress(address: string): string {
    if (!address) return ''
    return address
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`
  }

  return (
    <div className={account ? 'col-span-2' : ''}>
      {!account ? (
        <Button
          onClick={connectToLeapWallet}
          disabled={isConnecting}
          className='flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700'
        >
          {isConnecting ? 'Connecting...' : 'Connect Leap Wallet'}
        </Button>
      ) : (
        <div className='flex flex-col items-center'>
          <div className='p-4 mb-3 text-center rounded-lg bg-secondary'>
            <div className='mb-1 text-sm text-muted-foreground'>
              Connected to cheqd testnet
            </div>
            <div className='font-medium'>{formatAddress(account.address)}</div>
          </div>
          <button
            onClick={disconnectWallet}
            className='text-sm font-medium text-red-500 hover:text-red-700'
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
