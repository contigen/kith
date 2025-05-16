"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "lucide-react"

interface CredentialViewerProps {
  type: string
  issuer: string
  issuedDate: string
  subject: string
}

export function CredentialViewer({ type, issuer, issuedDate, subject }: CredentialViewerProps) {
  const [copied, setCopied] = useState(false)

  // Generate mock VC JSON
  const vcJson = {
    "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1"],
    id: `urn:uuid:${Math.random().toString(36).substring(2, 15)}`,
    type: ["VerifiableCredential", `${type}Credential`],
    issuer: `did:cheqd:mainnet:${issuer.toLowerCase().replace(/\s/g, "")}`,
    issuanceDate: issuedDate,
    credentialSubject: {
      id: subject,
      type: type,
      status: "verified",
    },
    proof: {
      type: "Ed25519Signature2020",
      created: issuedDate,
      verificationMethod: `did:cheqd:mainnet:${issuer.toLowerCase().replace(/\s/g, "")}#key-1`,
      proofPurpose: "assertionMethod",
      proofValue: "z58DAdFfa9SkqZMVPxAQpic6FPCsYh5UHsZzpLdHQMFgej5inGcXPRzfEgKMRQcXJzPQS2jyHudwCvwjNFMIpkQ",
    },
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(vcJson, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tabs defaultValue="preview">
      <div className="flex justify-between items-center mb-2">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-xs">
          <Code className="mr-2 h-3 w-3" />
          {copied ? "Copied!" : "Copy JSON"}
        </Button>
      </div>
      <TabsContent value="preview" className="mt-0">
        <div className="bg-muted p-4 rounded-md">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Type:</div>
            <div>{type} Credential</div>
            <div className="text-muted-foreground">Issuer:</div>
            <div>{issuer}</div>
            <div className="text-muted-foreground">Issuance Date:</div>
            <div>{new Date(issuedDate).toLocaleDateString()}</div>
            <div className="text-muted-foreground">Subject:</div>
            <div className="truncate">{subject}</div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="json" className="mt-0">
        <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">{JSON.stringify(vcJson, null, 2)}</pre>
      </TabsContent>
    </Tabs>
  )
}
