import {Application, viewEngine, etaEngine, oakAdapter} from "./deps.ts";
import router from "./router.ts";

const app = new Application();

app.use(
  viewEngine(oakAdapter, etaEngine, {
    viewRoot: "./views"
  })
);

app.use(router.routes());

await app.listen({ port: 8000 });

