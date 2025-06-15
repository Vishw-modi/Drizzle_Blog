import { db } from "@/db";
import { comments, posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import groupBy from "lodash-es/groupBy";

export default async function Home() {
  const allPost = await db.select().from(posts).orderBy(desc(posts.createdAt));
  const allComments = await db.select().from(comments);

  const postSpecificComment = groupBy(allComments, "postId");

  async function addComment(formData: FormData) {
    "use server";
    const postId = Number(formData.get("postId"));
    const content = formData.get("content") as string;

    await db.insert(comments).values({ postId, content });
    revalidatePath("/");
  }

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">All Posts</h1>
        <Link
          href="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + New Post
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {allPost.map((post) => (
          <div
            key={post.id}
            className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-5 flex flex-col justify-between"
          >
            <Link href={`/post/${post.id}`}>
              <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition">
                {post.title}
              </h2>
            </Link>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

            <p className="text-gray-700 mt-3">
              {post.content.substring(0, 100)}
              {post.content.length > 150 ? "..." : ""}
            </p>

            <form action={addComment} className="mt-4 space-y-2">
              <p>comments </p>
              <input type="hidden" name="postId" value={post.id} />
              <textarea
                name="content"
                rows={2}
                required
                placeholder="Write a comment..."
                className="w-full border px-3 py-2 rounded resize-none text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
              >
                Add Comment
              </button>
            </form>
            <div className="mt-3">
              {postSpecificComment[post.id]?.length ? (
                postSpecificComment[post.id].map((comment) => {
                  return (
                    <div
                      key={comment.id}
                      className="flex justify-between gap-1  border rounded mb-2 bg-gray-50"
                    >
                      <p className="text-gray-800">{comment.content}</p>
                      <p className="text-sm text-gray-500">
                        {comment.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 italic">No comments yet.</p>
              )}
            </div>
            <div className="flex flex-wrap mt-4 gap-2">
              <Link
                href={`/post/${post.id}`}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Read More
              </Link>
              <Link
                href={`/update/${post.id}`}
                className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
              >
                Update
              </Link>
              <Link
                href={`/delete/${post.id}`}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
