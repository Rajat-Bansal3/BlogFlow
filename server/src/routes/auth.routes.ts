import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { compareSync, hashSync } from "bcryptjs";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "testingdeploy";

const auth = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}>();

auth.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) return c.json({ message: "inputs invalid" });
  const hashedPass = hashSync(body.password, 10);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPass,
      name: body.name,
    },
  });
  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ message: "User Created Successfully", token });
});

auth.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) return c.json({ message: "inputs invalid" });
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (!user) return c.text("Invalid Credentials");

  const isValid = compareSync(body.password, user.password);

  if (!isValid) return c.text("Invalid Credentials");
  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ token });
});

export default auth;
