import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compareSync, hashSync } from "bcryptjs";
import { sign, verify } from "hono/jwt";
import {
  createPostInput,
  updatePostInput,
} from "testingdeploy";

const blogs = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogs.use("/*", async (c, next) => {
  try {
    const jwt = c.req.header("Authorization");
    if (!jwt) {
      c.status(401);
      return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(" ")[1];
    if (!token) return c.json({ error: "" });
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(401);
      return c.json({ error: "unauthorized" });
    }
    //@ts-ignore
    c.set("userId", payload.id);
    await next();
  } catch (error) {
    console.log(error, "middleware");
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
});

blogs.get("/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const page = parseInt(c.req.query("page") || "1", 10);
    const limit = parseInt(c.req.query("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const blogs = await prisma.post.findMany({
      skip: skip,
      take: limit,
    });
    if (!blogs) return c.json({ message: "no blogs found" });

    const totalBlogs = await prisma.post.count();
    const totalPages = Math.ceil(totalBlogs / limit);

    return c.json({
      message: "blogs fetched successfully",
      blogs,
      pagination: {
        totalBlogs,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    c.status(500);
    return c.json({ message: "error fetching blogs" });
  }
});
blogs.get("/:id", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = c.req.param("id");
    const blog = await prisma.post.findFirst({ where: { id: id } });
    if (!blog) return c.json({ message: "no blogs found" });

    return c.json({ message: "blog fetched successfully", blog });
  } catch (error) {
    c.status(500);
    return c.json({ message: "error fetching blog" });
  }
});

blogs.post("/", async (c) => {
  try {
    const id = c.get("userId");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = createPostInput.safeParse(body);
    if (!success) return c.json({ message: "inputs invalid" });
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
        authorId: id,
      },
    });

    return c.json({ message: "Blog created successfully", blogId: blog.id });
  } catch (error) {
    c.status(500);
    c.json({ message: "error creating blog" });
  }
});

blogs.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = updatePostInput.safeParse(body);
    if (!success) return c.json({ message: "inputs invalid" });
    const blog = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({ message: "Blog updated successfully", blogId: blog.id });
  } catch (error) {
    c.status(500);
    c.json({ message: "error updating blog" });
  }
});

export default blogs;
