import 'server-only'
import prisma from './prisma'
import { Prisma } from '@prisma/client'
import { withTryCatch } from './utils'

export type CreateAgentInput = Prisma.AgentCreateInput

export type CreateRequestCredential = Prisma.CredentialRequestCreateInput

export function createAgent(data: CreateAgentInput) {
  console.log('data:', data)
  return withTryCatch(async () => {
    return await prisma.agent.create({
      data,
    })
  })
}

export function findAgent(agentId: string) {
  return withTryCatch(async () => {
    return await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        credentials: true,
        timelineEvents: true,
        auditReports: true,
      },
    })
  })
}

export type Agent = Awaited<ReturnType<typeof findAgent>>

export function getAgents() {
  return withTryCatch(async () => {
    return await prisma.agent.findMany({
      include: {
        credentials: true,
        auditReports: true,
        timelineEvents: true,
      },
    })
  })
}

export function findAgentByDID(did: string) {
  return withTryCatch(async () => {
    return await prisma.agent.findUnique({
      where: { did },
      include: {
        credentials: true,
      },
    })
  })
}

export function countAgents() {
  return withTryCatch(async () => {
    return await prisma.agent.count()
  })
}

export function getCredentials() {
  return withTryCatch(async () => {
    return await prisma.credential.findMany({
      include: {
        agent: true,
      },
    })
  })
}

export function findCredentialByID(id: string) {
  return withTryCatch(async () => {
    return await prisma.credential.findFirst({
      where: {
        agentId: id,
      },
    })
  })
}

export type VCredential = Awaited<ReturnType<typeof getCredentials>>

export async function createRequestCredential(data: CreateRequestCredential) {
  return withTryCatch(async () => {
    return await prisma.credentialRequest.create({
      data,
      include: {
        credential: {
          include: {
            agent: true,
          },
        },
      },
    })
  })
}

export async function getCredentialRequests() {
  return withTryCatch(async () => {
    return await prisma.credentialRequest.findMany({
      include: {
        credential: {
          include: {
            agent: true,
          },
        },
      },
    })
  })
}

export type VCredentialRequest = Awaited<
  ReturnType<typeof getCredentialRequests>
>
