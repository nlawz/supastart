import { notFound, redirect } from "next/navigation"

import { Editor } from "@/components/editor"
import { getPostForUser, getUser } from "@/app/supabase-server"

interface EditorPageProps {
  params: { postId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getUser()

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
