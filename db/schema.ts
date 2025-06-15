import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    postId: serial("post_id").references(() => posts.id).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
})