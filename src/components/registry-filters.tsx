"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function RegistryFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by agent name, creator, or DID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="trusted">Most Trusted</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine the agent registry results</SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Trust Score</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="trust-high" />
                      <Label htmlFor="trust-high">High Trust (90-100%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="trust-medium" />
                      <Label htmlFor="trust-medium">Medium Trust (70-89%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="trust-low" />
                      <Label htmlFor="trust-low">Low Trust (0-69%)</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Credentials</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cred-creator" />
                      <Label htmlFor="cred-creator">Creator Verified</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cred-safety" />
                      <Label htmlFor="cred-safety">Safety Audit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cred-capability" />
                      <Label htmlFor="cred-capability">Capability VC</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Issuers</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="issuer-openai" />
                      <Label htmlFor="issuer-openai">OpenAI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="issuer-anthropic" />
                      <Label htmlFor="issuer-anthropic">Anthropic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="issuer-safety" />
                      <Label htmlFor="issuer-safety">AI Safety Institute</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline">Reset</Button>
                <Button>Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
