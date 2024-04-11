import swagger from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

class Logger {
  log(value: string) {
    console.log(value);
  }
}
class Trace {
  log(value: string) {
    console.log(value + " Trace");
  }
}
class Telemetry {
  log(value: string) {
    console.log(value + " Telemetry");
  }
}

const setup = new Elysia({ name: "setup" }).decorate({
  argon: "a",
  boron: "b",
  carbon: "c",
});

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
  .get("/error", ({ error }) => error(418, "kirifuji Nagisa"))
  .get("/redirect", ({ set }) => {
    set.redirect = "https://youtu.be/whpVWVWBW4U?&t=8";
  })
  .get("/response", () => new Response("hi"))
  .onError(({ code }) => {
    if (code === "NOT_FOUND") {
      return "Route Not Found";
    }
  })

  //store
  .state("version", 1)
  .get("/a", ({ store: { version } }) => version) //get a data from json/store version
  .get("/b", ({ store }) => store) // get a json from store
  .get("/c", () => "still ok") // just text

  // store counter
  .state("counter", 0) //set store that key is counter that value is 0
  .get("/counter", ({ store }) => store.counter) //get store that key is counter that value is 0

  // decorate
  .decorate("logger", new Logger())
  .get("/log", ({ logger }) => {
    logger.log("hi");
    return "hi";
  })

  // derive
  .derive(({ headers }) => {
    const auth = headers["authorization"];
    return {
      bearer: auth?.startsWith("Bearer ") ? auth?.slice(7) : null,
    };
  })
  .get("/bearer", ({ bearer }) => bearer)
  // Pattern
  // .state('counter',0)
  // .decorate('logger',new Logger())

  // Object
  .decorate({
    // logger: new Logger(),
    trace: new Trace(),
    telemetry: new Telemetry(),
  })

  // Remap
  .state("counter", 0)
  .state("versions", 1)
  .state(
    ({
      versions, // will remove because return that return versions are not include
      ...store
    }) => ({
      ...store,
      elysiaVersion: 1, // add a store nesting other store
    })
  )
  .get("/elysia-version", ({ store }) => store.elysiaVersion)

  // Affix
  .use(setup.prefix("decorator", "setup"))
  .get("/setup/a", ({ logger, setupArgon, ...rest }) => {
    console.log(rest);
    return setupArgon;
  })
  .get("/setup/b", ({ setupBoron, ...rest }) => setupBoron)
  .get("/setup/c", ({ setupCarbon, ...rest }) => setupCarbon)

  // Affix 2
  .use(setup.prefix("all", "setup2"))
  .get("/setup2", ({ setup2Carbon, ...rest }) => setup2Carbon)

  // Reference and value
  .state("counter2", 0)
  .get("/counter2", ({ store }) => store.counter2++)
  // 
  .listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
