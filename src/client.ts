import { treaty } from "@elysiajs/eden";
import type { App } from "./index";

const app = treaty<App>("localhost:3000");

const { data } = await app.user({ id: 617 }).get();
console.log(data);
