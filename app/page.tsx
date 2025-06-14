import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function Home() {
  const allPost = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return (
    <div className="container mx-auto p-4 bg-wh">
      <h1 className="text-3xl font-bold">All posts</h1>
      <Link href="/create" className="text-blue-500">
        Create New Post
      </Link>
      <div className="space-y-4 mt-4">
        {allPost.map((posts) => (
          <div key={posts.id} className="border rounded  p-4 ">
            <Link href={`/post/${posts.id}`}>
              <div className="font-semibold text-xl hover:text-blue-500  duration-300">
                {posts.title}
              </div>
            </Link>
            <p className="text-sm text-gray-600">
              {new Date(posts.createdAt).toLocaleDateString()}
            </p>

            <p className="mt-2">
              {posts.content.substring(0, 100)}{" "}
              {posts.content.length > 150 ? "..." : ""}
            </p>
            <div className="mt-2 ">
              <Link href={`post/${posts.id}`} className="text-blue-500 mr-2">
                Read more
              </Link>
              <Link href={`update/${posts.id}`} className="text-blue-500 mr-2">
                Update
              </Link>
              <Link href={`delete/${posts.id}`} className="text-red-500 mr-2">
                delete
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
