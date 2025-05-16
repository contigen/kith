const BASE_URL = `https://studio-api.cheqd.net`
const TOKEN = process.env.CHEQD_API_KEY

export async function cheqdApiClient<T>(
  endpoint: string,
  opts: RequestInit = {}
): Promise<T> {
  if (!TOKEN) throw new Error(`API Key not set`)

  const API_BASE_URL = `${BASE_URL}/${endpoint}`
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': TOKEN,
      ...((opts.headers as Record<string, string>) || {}),
    }

    const response = await fetch(API_BASE_URL, {
      headers,
      ...opts,
    })
    if (!response.ok) {
      let errData
      try {
        errData = await response.json()
      } catch {
        errData = null
      }
      if (errData) return errData
      const err = new Error(`HTTP Error`)
      err.name = `Error ${response.status}`
      err.cause = response.statusText
      throw err
    }
    return response.json()
  } catch (err: unknown) {
    throw err
  }
}
