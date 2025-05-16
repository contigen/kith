import { cn } from "@/lib/utils"

interface TrustScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
}

export function TrustScoreBadge({ score, size = "md" }: TrustScoreBadgeProps) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 90) return "text-green-500 border-green-500"
    if (score >= 70) return "text-yellow-500 border-yellow-500"
    return "text-red-500 border-red-500"
  }

  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8 text-xs"
      case "lg":
        return "h-16 w-16 text-xl"
      default:
        return "h-12 w-12 text-sm"
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-full border-2 flex items-center justify-center font-bold",
        getSizeClasses(),
        getColor(),
      )}
    >
      {score}
    </div>
  )
}
