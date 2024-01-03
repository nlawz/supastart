import { cookies } from "next/headers"
import { createRouteHandlerClient  } from "@supabase/auth-helpers-nextjs"
import * as z from "zod"

import { Database } from "@/types/db"
import { postPatchSchema } from "@/lib/validations/post"

const routeContextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.postId))) {
      return new Response(null, { status: 403 })
    }
    // Delete the post.
    await supabase.from("posts").delete().eq("id", params.postId)

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.postId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = postPatchSchema.parse(json)

    // Update the post.
    // TODO: Implement sanitization for content.
    await supabase
      .from("posts")
      .update({
        title: body.title,
        content: body.content,
      })
      .eq("id", params.postId)
      .select()

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  const supabase = createRouteHandlerClient <Database>({
    cookies,
  })
  const {
    data: { session },
  } = await supabase.auth.getSession()

   // Check if session or user id is undefined
  if (!session?.user?.id) {
    return false
  }

  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("id", postId)
    .eq("author_id", session?.user.id)

  return count ? count > 0 : false
}
