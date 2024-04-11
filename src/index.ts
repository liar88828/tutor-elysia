import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

const app = new Elysia()
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .get("/user/:id", ({ params: { id } }) => id, {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .get("/id/:id/:name", ({ params: { id, name } }) => id + " " + name)
  .post("/form", ({ body }) => body, {
    body: t.Object({
      name: t.String(),
      address: t.String(),
      phone: t.Numeric(),
    }),
  })
  .onError(({ code }) => {
    if (code === "NOT_FOUND") {
      return "Route Not Found";
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
