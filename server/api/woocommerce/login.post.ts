import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    return { success: false, error: 'Veuillez renseigner vos identifiants.' }
  }

  try {
    const resp = await fetch(`${process.env.WORDPRESS_URL}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await resp.json()

    if (data.token) {
      return { success: true, token: data.token, user: data.user_display_name }
    } else {
      return { success: false, error: data.message || 'Identifiants incorrects' }
    }
  } catch (err) {
    return { success: false, error: 'Connexion impossible. Vérifiez votre WordPress et le plugin JWT.' }
  }
})
