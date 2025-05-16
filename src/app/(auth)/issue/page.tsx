import { getCredentialRequests } from '@/lib/db-queries'
import { IssueView } from './issue-view'
import { redirect } from 'next/navigation'

export default async function IssuePage() {
  const credentialRequests = await getCredentialRequests()
  if (!credentialRequests) redirect('/dashboard/request-credential')
  return <IssueView credentialRequests={credentialRequests} />
}
