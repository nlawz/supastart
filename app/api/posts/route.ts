import { cookies } from "next/headers"
import { createRouteHandlerClient  } from "@supabase/auth-helpers-nextjs"
import * as z from "zod"

import { Database } from "@/types/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const postCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
})

export async function GET() {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { data: posts } = await supabase
      .from("posts")
      .select("id, title, published, created_at")
      .eq("author_id", session.user.id)
      .order("updated_at", { ascending: false })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    // If user is on a free plan.
    // Check if user has reached limit of 3 posts.
    if (!subscriptionPlan?.isPro) {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("author_id)", user.id)

      if (count && count >= 3) {
        throw new RequiresProPlanError()
      }
    }

    const json = await req.json()
    const body = postCreateSchema.parse(json)

    const { data: post } = await supabase
      .from("posts")
      .insert({
        title: body.title,
        content: body.content,
        author_id: session.user.id,
      })
      .select()

    return new Response(JSON.stringify(post))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 })
    }

    return new Response(null, { status: 500 })
  }
}
