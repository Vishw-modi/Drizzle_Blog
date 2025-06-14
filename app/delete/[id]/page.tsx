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
    <div className="container mx-auto p-4">
      <Link href="/" className="text-blue-500 inline-block mb-4">
        Back To All Posts
      </Link>
      <article>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-600">
          Published on {new Date(post.createdAt).toLocaleDateString()}{" "}
          {post.updatedAt > post.createdAt &&
            `Updated on ${new Date(post.updatedAt).toLocaleDateString()}`}
        </p>
        <p className="mt-2">{post.content}</p>
      </article>

      <form action={deletePost}>
        <button
          type="submit"
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </form>
    </div>
  );
};

export default page;
