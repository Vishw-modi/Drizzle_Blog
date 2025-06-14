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
    <div className="container mx-auto p-6 max-w-xl">
      <Link
        href={`/post/${post.id}`}
        className="inline-block mb-6 text-blue-500"
      >
        Back to Post
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form
        action={updatePost}
        className="space-y-6 bg-white p-6 rounded shadow"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={post.title}
            required
            className="w-full border text-slate-500 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={4}
            required
            defaultValue={post.content}
            className="w-full border text-slate-400 border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default Page;
