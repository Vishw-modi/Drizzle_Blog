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
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 inline-block mb-4">
        {" "}
        Back To All Posts{" "}
      </Link>
      <article>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-600">
          Published on{new Date(post.createdAt).toLocaleDateString()}{" "}
          {post.updatedAt > post.createdAt &&
            `Updated on ${new Date(post.updatedAt).toLocaleDateString()}`}
        </p>
        <p className="mt-2">{post.content}</p>
      </article>
      <div>
        <Link href={`/update/${post.id}`} className="text-blue-500 mr-2">
          Update
        </Link>
        <Link href={`/delete/${post.id}`} className="text-red-500">
          Delete
        </Link>
      </div>
    </div>
  );
};

export default page;
