import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { postValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  const subscriptions = db.subscription;
  const posts = db.post;

  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId, title, content } = postValidator.parse(body);

    const findSubscription = await subscriptions.findUnique({
      where: {
        userId_subredditId: {
          subredditId: subredditId,
          userId: session.user.id,
        },
      },
    });

    if (!findSubscription) {
      return new Response("Subscribe to the subreddit first", { status: 409 });
    }

    if (findSubscription?.unsubscribe === true) {
      return new Response("Subscribe to the subreddit first", { status: 409 });
    }

    await posts.create({
      data: {
        title: title,
        content: content,
        subredditId: subredditId,
        authorId: session.user.id,
      },
    });

    return new Response("Post created", { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid Post Data", { status: 400 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
