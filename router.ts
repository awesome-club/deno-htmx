import { Router, Context, send } from "./deps.ts";
import { getPost, EmptyPost, getPosts, createPost, updatePost, deletePost, searchPosts } from "./service.ts";

async function getPostHandler(ctx: Context) {
  ctx.render("posts.html", {
    posts: await getPosts()
  });
}

async function searchPostsHandler(ctx: Context) {
  const key = ctx.request.url.searchParams.get("key");
  ctx.render("posts.html", {
    posts: await searchPosts(key ?? "")
  })
}

async function createPostHandler(ctx: Context) {
  const body = await ctx.request.body().value;
  const id = body.get("id");
  const title = body.get("title");
  const content = body.get("content");

  if (id) {
    await updatePost({id, title, content});
  } else {
    await createPost({title, content});
  }

  ctx.render("posts.html", {
    posts: await getPosts()
  });
}

async function deletePostHandler(ctx: Context) {
  const {id} = ctx.params;
  await deletePost(id);
  ctx.render("posts.html", {
    posts: await getPosts()
  });
}

async function postFormHandler(ctx: Context) {
  const {id} = ctx.params;
  const post = id ? await getPost(id) : EmptyPost;
  ctx.render("post-form.html", post);
}

async function cssHandler(ctx: Context) {
  await send(ctx, "/main.css", {
    root: `${Deno.cwd()}/styles`,
    index: "main.css",
  });
}

async function imgHandler(ctx: Context) {
  await send(ctx, "/hero.png", {
    root: `${Deno.cwd()}/img`,
    index: "hero.png",
  });
}

export default new Router()
  .get("/", ctx => ctx.render("index.html"))
  .get("/search", searchPostsHandler)
  .get("/posts", getPostHandler)
  .get("/posts/form/:id?", postFormHandler)

  .post("/posts", createPostHandler)
  .delete("/posts/:id", deletePostHandler)

  .get("/main.css", cssHandler)
  .get("/hero.png", imgHandler);
