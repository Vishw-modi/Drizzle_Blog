import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Params = {
  params: {
    id: string;
  };
};

const page = async ({ params }: Params) => {
  const post_id = Number(params.id);

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, post_id))
    .then((res) => res[0]);

  async function deletePost() {
    "use server";
    await db.delete(posts).where(eq(posts.id, post_id));
    revalidatePath("/");
    throw redirect("/");
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Link
        href="/"
        className="inline-block text-blue-600 hover:underline mb-6"
      >
        ← Back to All Posts
      </Link>

      <article className="bg-white border border-gray-200 shadow-md rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Published on {new Date(post.createdAt).toLocaleDateString()}
          {post.updatedAt > post.createdAt && (
            <> · Updated on {new Date(post.updatedAt).toLocaleDateString()}</>
          )}
        </p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>

      <form action={deletePost} className="mt-6">
        <p className="text-red-600 mb-2">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Confirm Delete
          </button>
          <Link
            href={`/post/${post.id}`}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default page;
