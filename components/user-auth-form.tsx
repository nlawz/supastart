"use client"

import { Auth } from "@supabase/auth-ui-react"

import { getURL } from "@/lib/utils"
import { useSupabase } from "@/app/supabase-provider"

export default function UserAuthForm() {
  const { supabase } = useSupabase()
  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={["github", "google"]}
        redirectTo={getURL()}
        magicLink={true}
        appearance={{
          className: {
            anchor: "",
            button:
              "!bg-primary !text-primary-foreground hover:!bg-primary/90 !rounded-md !h-10 sm:!h-9 sm:!px-3 lg:!h-11 lg:!px-8",
            container: " ",
            divider: "",
            input:
              "!h-10 !rounded-md border !border-input !bg-transparent !px-3 !py-2 !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium placeholder:!text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50",
            label: "!mb-2 !text-xs hover:!cursor-pointer",
            loader: "",
            message: "",
          },
        }}
      />
    </div>
  )
}
