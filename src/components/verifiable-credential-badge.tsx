import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CheckCircle, XCircle, Shield, User, Zap } from 'lucide-react'

interface VerifiableCredentialBadgeProps {
  type: string
  verified: boolean
}

export function VerifiableCredentialBadge({
  type,
  verified,
}: VerifiableCredentialBadgeProps) {
  const getIcon = () => {
    switch (type) {
      case 'Creator':
        return <User className='h-3 w-3 mr-1' />
      case 'Safety':
        return <Shield className='h-3 w-3 mr-1' />
      case 'Capability':
        return <Zap className='h-3 w-3 mr-1' />
      default:
        return null
    }
  }

  const getBadgeVariant = () => {
    return verified ? 'default' : 'outline'
  }

  const getStatusIcon = () => {
    return verified ? (
      <CheckCircle className='h-3 w-3 ml-1' />
    ) : (
      <XCircle className='h-3 w-3 ml-1' />
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getBadgeVariant()} className='flex items-center'>
            {getIcon()}
            {type}
            {getStatusIcon()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {verified
              ? `${type} credential verified`
              : `${type} credential not verified`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
