// server/api/auth/register.post.ts
import { defineEventHandler, readBody, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { username: string; email: string; password?: string }
  const WP_URL = process.env.WP_URL || 'http://ivoir-shop.local'

  // call WP endpoint we created
  const res = await $fetch<{ token?: string }>(`${WP_URL}/wp-json/my/v1/register`, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' }
  })

  // if WP returned a token, store it httpOnly
  if (res?.token) {
    setCookie(event, 'token', res.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
  }

  return res
})
