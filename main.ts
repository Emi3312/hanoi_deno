import { Application, Router, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const app = new Application();
const router = new Router();

// Logger middleware
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Rutas
router.get("/", async (ctx) => {
  await ctx.send({
    root: `${Deno.cwd()}`,
    index: "juego.html",
  });
});

// Manejo de errores
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = "Error interno del servidor";
  }
});

// Usar el router
app.use(router.routes());
app.use(router.allowedMethods());

// Configurar puerto
const port = parseInt(Deno.env.get("PORT") || "3001");

// Iniciar servidor
console.log(`Servidor iniciado en http://localhost:${port}`);
await app.listen({ port });