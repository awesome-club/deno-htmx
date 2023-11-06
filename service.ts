const kv = await Deno.openKv();

type Post = {
  id: string;
  title: string;
  content: string;
}

export const EmptyPost = {
  id: "",
  title: "",
  content: "",
}

export async function searchPosts(key: string) {
  const posts = await getPosts()
  return posts
  .filter(it => it.title.indexOf(key) > -1)
}

export async function getPost(id: string) {
  return (await kv.get(["posts", id])).value;
}

export async function getPosts() {
  const posts = [] as Post[];

  const entries = kv.list({ prefix: ["posts"] });
  for await (const entry of entries) {
    posts.push(entry.value);
  }

  return posts;
}

export async function createPost(post: Partial<Post>) {
  const id = crypto.randomUUID();
  kv.set(["posts", id], {...post, id});
}

export async function updatePost(data: Partial<Post>) {
  const post = await getPost(data.id!);
  post.title = data.title ?? "";
  post.content = data.content ?? "";
  kv.set(["posts", data.id!], {...post});
}

export async function deletePost(id: string) {
  kv.delete(["posts", id]);
}
