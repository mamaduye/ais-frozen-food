import { supabase } from "./client"

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("GET CURRENT USER ERROR:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("GET CURRENT USER FETCH ERROR:", error)
    return null
  }
}

export async function logout() {
  await supabase.auth.signOut()
}