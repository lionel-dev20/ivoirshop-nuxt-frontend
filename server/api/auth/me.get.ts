import { defineEventHandler, getCookie } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) return null

  try {
    const { data } = await axios.get(`${process.env.WP_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return {
      id: data.id,
      username: data.username,
      email: data.email,
    }
  } catch (err) {
    return null
  }
})
