import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function PUT(req: Request) {
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
        unsubscribe: false,
      },
    });

    if (!findSubscription) {
      return new Response("You are not subscribed", { status: 409 });
    }

    const Subscription = await subscriptions.update({
      where: {
        userId_subredditId: {
          subredditId: subredditId,
          userId: session.user.id,
        },
      },
      data: {
        unsubscribe: true,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Unsubscribed Successfully",
        Subscription: Subscription,
      }),
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response("Invalid request data", { status: 422 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
