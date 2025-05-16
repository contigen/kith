"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

const issuers = [
  {
    id: 1,
    name: "AI Safety Institute",
    logo: "/placeholder.svg?height=80&width=80",
    credentials: ["Safety Audit", "Capability Assessment"],
    verified: true,
  },
  {
    id: 2,
    name: "OpenAI",
    logo: "/placeholder.svg?height=80&width=80",
    credentials: ["Creator Verification", "Model Card"],
    verified: true,
  },
  {
    id: 3,
    name: "Anthropic",
    logo: "/placeholder.svg?height=80&width=80",
    credentials: ["Creator Verification", "Safety Audit"],
    verified: true,
  },
  {
    id: 4,
    name: "AI Alignment Lab",
    logo: "/placeholder.svg?height=80&width=80",
    credentials: ["Alignment Certification", "Safety Audit"],
    verified: true,
  },
  {
    id: 5,
    name: "Google DeepMind",
    logo: "/placeholder.svg?height=80&width=80",
    credentials: ["Creator Verification", "Capability Assessment"],
    verified: true,
  },
]

export function TrustedIssuersCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % issuers.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Show 3 issuers on desktop, 1 on mobile
  const visibleIssuers = []
  for (let i = 0; i < 3; i++) {
    visibleIssuers.push(issuers[(activeIndex + i) % issuers.length])
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-6 transition-transform duration-500 ease-in-out">
        {visibleIssuers.map((issuer, index) => (
          <Card
            key={`${issuer.id}-${index}`}
            className={`min-w-[280px] md:min-w-0 md:w-1/3 flex-shrink-0 ${index > 0 ? "hidden md:block" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={issuer.logo || "/placeholder.svg"}
                    alt={issuer.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  {issuer.verified && (
                    <CheckCircle className="absolute bottom-0 right-0 h-6 w-6 text-green-500 bg-background rounded-full" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-bold">{issuer.name}</h3>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {issuer.credentials.map((credential) => (
                      <Badge key={credential} variant="secondary">
                        {credential}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {issuers.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === activeIndex % issuers.length ? "bg-primary" : "bg-muted"}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
