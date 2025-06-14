import { db } from "@/db";
import { posts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

const CreatePostPage = () => {
  async function createPost(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await db.insert(posts).values({ title, content });

    revalidatePath("/");
    redirect("/");
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Create New Post</h1>

      <form
        action={createPost}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 space-y-6"
      >
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter post title"
            required
            className="w-full border text-slate-600 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content Field */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Write your content here..."
            required
            className="w-full border text-gray-600 border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
