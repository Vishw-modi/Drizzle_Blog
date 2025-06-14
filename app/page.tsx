import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function Home() {
  const allPost = await db.select().from(posts).orderBy(desc(posts.createdAt));

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
