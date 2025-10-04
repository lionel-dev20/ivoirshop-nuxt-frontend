import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string; password: string }>(event)

  try {
    const { data } = await axios.post(
      `${process.env.WORDPRESS_URL}/wp-json/jwt-auth/v1/token`,
      {
        username: body.username,
        password: body.password,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    // Stocke le token dans un cookie httpOnly
    setCookie(event, 'auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1h
    })

    return {
      user: {
        id: data.user_id,
        username: data.name,
        email: data.email,
      },
      token: data.token,
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.response?.status || 401,
      statusMessage: err.response?.data?.message || 'Connexion impossible',
    })
  }
})
