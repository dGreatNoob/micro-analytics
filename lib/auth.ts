/**
 * Authentication utilities for Microlytics
 * 
 * This is a simple client-side auth helper for demo purposes.
 * In production, replace with NextAuth.js, Supabase Auth, Clerk, or similar.
 */

// Check if user is authenticated (client-side only)
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return document.cookie.includes('auth-token=')
}

// Login helper (demo implementation)
export function login(token: string) {
  if (typeof window === 'undefined') return
  document.cookie = `auth-token=${token}; path=/; max-age=2592000` // 30 days
}

// Logout helper
export function logout() {
  if (typeof window === 'undefined') return
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
  window.location.href = '/'
}

// Get auth token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  const matches = document.cookie.match(/auth-token=([^;]+)/)
  return matches ? matches[1] : null
}

// Mock user data (replace with real API call)
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAuthToken()
  if (!token) return null
  
  // TODO: Replace with actual API call
  // const response = await fetch('/api/user/me', {
  //   headers: { Authorization: `Bearer ${token}` }
  // })
  // return response.json()
  
  // Mock user for demo
  return {
    id: '1',
    name: 'Demo User',
    email: 'demo@microlytics.com',
    avatar: undefined,
  }
}

