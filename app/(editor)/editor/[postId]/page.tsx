import { notFound, redirect } from "next/navigation"

import { Post, User } from "@/types/types"
import {
  createServerSupabaseClient,
  getUserServer,
} from "@/lib/supabase-server"
import { Editor } from "@/components/editor"

async function getPostForUser(postId: Post["id"], userId: User["id"]) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("author_id", userId)
    .single()
  return data
}

interface EditorPageProps {
  params: { postId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { user } = await getUserServer()

  if (!user) {
    redirect("/login")
  }

  const post = await getPostForUser(params.postId, user.id)

  if (!post) {
    notFound()
  }

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
      }}
    />
  )
}
