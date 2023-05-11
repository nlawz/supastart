import { cookies, headers } from "next/headers"
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/db"

export const createServerSupabaseClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })

  export const getUserServer = async () => {
    const supabase = createServerSupabaseClient()
  try {
    const { data: user } = await supabase.from("users").select("*").single()
    return {
      user
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      user: null,
    }
  }
}
