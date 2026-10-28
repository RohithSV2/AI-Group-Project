import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '@/store/authStore'
import { handleMockRequest } from './mockBackend'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// ── In-App Embedded Backend (Zero-Sleeping Portfolio Mode) ────────────────
// Handles all API requests locally on Vercel without requiring an external server.
// Recruiter & Evaluator Ready: Full state persistence in localStorage.
api.defaults.adapter = async (config: any): Promise<AxiosResponse> => {
  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''

  // Parse payload safely (JSON string, FormData, or raw object)
  let parsedData: any = undefined
  if (config.data) {
    if (typeof config.data === 'string') {
      try {
        parsedData = JSON.parse(config.data)
      } catch {
        parsedData = config.data
      }
    } else {
      parsedData = config.data
    }
  }

  // If a live remote backend URL is provided AND user explicitly wants to use it:
  if (
    import.meta.env.VITE_USE_REAL_BACKEND === 'true' &&
    import.meta.env.VITE_API_BASE_URL &&
    !import.meta.env.VITE_API_BASE_URL.startsWith('/api')
  ) {
    try {
      const defaultAdapter = axios.defaults.adapter
      if (typeof defaultAdapter === 'function') {
        return await (defaultAdapter as any)(config)
      }
    } catch (networkError) {
      console.warn(
        '[HireMatch AI] Remote backend unreachable or sleeping. Falling back to embedded offline engine.',
        networkError
      )
    }
  }

  // Handle request in-app
  const mockResult = handleMockRequest(method, url, parsedData)

  // Simulate realistic network delay (60ms)
  await new Promise((resolve) => setTimeout(resolve, 60))

  return {
    data: mockResult,
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config,
  } as any
}

// ── Request interceptor: attach access token ─────────────────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
