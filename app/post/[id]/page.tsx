import React from "react";
import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = {
  params: {
    id: string;
  };
};

const page = async ({ params }: Awaited<Params>) => {
  const post_id = Number(params.id);
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, post_id))
    .then((res) => res[0]);

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        ← Back to All Posts
      </Link>

      <article className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>

        <div className="text-sm text-gray-500 mb-4">
          <p>Published on {new Date(post.createdAt).toLocaleDateString()}</p>
          {post.updatedAt > post.createdAt && (
            <p>Updated on {new Date(post.updatedAt).toLocaleDateString()}</p>
          )}
        </div>

        <div className="text-gray-700 leading-relaxed space-y-4">
          {post.content.split("\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>

      <div className="mt-6 flex gap-4">
        <Link
          href={`/update/${post.id}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          Update
        </Link>
        <Link
          href={`/delete/${post.id}`}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Delete
        </Link>
      </div>
    </div>
  );
};

export default page;
