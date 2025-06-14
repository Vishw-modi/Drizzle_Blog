import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Params = {
  params: { id: string };
};

const Page = async ({ params }: Params) => {
  const post_id = Number(params.id);

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, post_id))
    .then((res) => res[0]);

  async function updatePost(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await db
      .update(posts)
      .set({ title, content, updatedAt: new Date() })
      .where(eq(posts.id, post_id));

    revalidatePath(`/post/${post_id}`);
    revalidatePath("/");
    redirect(`/post/${post_id}`);
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Link
        href={`/post/${post.id}`}
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        ← Back to Post
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Post</h1>

      <form
        action={updatePost}
        className="space-y-6 bg-white border border-gray-200 rounded-2xl shadow-md p-6"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post.title}
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            required
            autoFocus
            defaultValue={post.content}
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
