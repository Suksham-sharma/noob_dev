import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  const subreddits = db.subreddit;
  const subscriptions = db.subscription;
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = subredditValidator.parse(body);

    const findSubreddit = await subreddits.findUnique({
      where: { name },
    });

    if (findSubreddit) {
      return new Response("Subreddit already exists", { status: 409 });
    }

    const newSubreddit = await subreddits.create({
      data: {
        name,
        createrId: session.user.id,
      },
    });

    await subscriptions.create({
      data: {
        userId: session.user.id,
        subredditId: newSubreddit.id,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Subreddit created",
        subreddit: newSubreddit,
      }),
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
