import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  const subscriptions = db.subscription;

  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = subredditSubscriptionValidator.parse(body);

    const findSubscription = await subscriptions.findFirst({
      where: {
        subredditId: subredditId,
        userId: session.user.id,
      },
    });

    if (findSubscription) {
      return new Response("Already subscribed", { status: 409 });
    }

    const newSubscription = await subscriptions.create({
      data: {
        userId: session.user.id,
        subredditId: subredditId,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Subscription created",
        subscription: newSubscription,
      }),
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data", { status: 422 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
