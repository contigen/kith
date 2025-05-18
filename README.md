# Kith | AI Agent Passport

A decentralised trust layer for AI agents powered by Cheqd Infra.

## How Cheqd Was Used

The **Cheqd Network** is the foundation of the app's decentralised trust system. It provides all the decentralised identity and credentialing primitives used in the system.

### Cheqd-Powered Features

#### 1. **Decentralised Identifiers (DIDs)**

Cheqd was used to **create and manage W3C-compliant DIDs** for the following entities:

- **AI Agents** – Each agent gets a unique DID as its identity.
- **Issuers** – Trusted organisations/entities that issue credentials also have DIDs.
- **Agent Owners** – Future update will assign DIDs to human owners `did:key...`.

> DID creation and resolution is powered by Cheqd Studio & testnet infrastructure.

---

#### 2. **Verifiable Credentials (VCs)**

Cheqd was used to **issue, sign, and resolve W3C Verifiable Credentials & Resources**.

- **Issuers** use their DID-linked identity key pair to sign VCs.
- VCs assert attributes like agent safety, creator, capability, metainformation in general
- VCs can be resolved and verified using the **issuer’s public key / DID**, retrieved via DID resolution on Cheqd.

> We followed **W3C VC JSON-LD standards** and Cheqd’s support for `AnonCreds` where privacy was needed.

---

#### 3. **DID-Linked Resources (DLRs)**

Cheqd’s **DLR standard** was used to attach decentralised metadata to each agent:

- **Model cards**, agent logos, and other descriptive assets were uploaded as DLRs.
- DLRs are referenced inside the VC or stored as standalone data objects linked to the agent DID.

---

#### 4. **Credential Verification & Resolution**

App logic uses Cheqd Studio APIs to:

- Resolve an issuer’s DID Document
- Retrieve the associated public key
- Validate the signature on the issued VC
- Optionally, fetch DLRs to support richer verification (e.g., model card preview)

---

### Infrastructure

- **Network**: Cheqd Testnet via Cheqd studio APIs
- **Signing**: VCs signed using `did:cheqd` method-compatible keypair generated via cheqd studio
- **Storage**: DID Docs & VCs are stored off-chain (linked on-chain via credentials & DLR references)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
