import { redirect } from "next/navigation"

import { getUser } from "@/app/supabase-server"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }
  return <div className="min-h-screen">{children}</div>
}
