import { Hono } from "hono";
import auth from "./routes/auth.routes";
import blogs from "./routes/blogs.routes";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}>();
app.use(cors());
app.route("/api/v1/user", auth);
app.route("/api/v1/blog", blogs);

export default app;
