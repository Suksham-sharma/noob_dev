import { Button } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format, sub } from "date-fns";
import { notFound } from "next/navigation";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();
  const subreddits = db.subreddit;
  const subscriptions = db.subscription;

  const findSubreddit = await subreddits.findUnique({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const findSubscription = !session?.user
    ? undefined
    : await subscriptions.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = findSubscription ? true : false;

  if (!findSubreddit) return notFound();

  const memberCount = await subscriptions.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        {/* TODO : A Button which takes us back to feed  */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>

          {/* info sidebar */}
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-400 order-first md:order-last">
            <div className="px-6 py-4">
              {findSubreddit.createrId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4">
                  <p className="font-semibold py-3"> About r/{slug}</p>
                  <Button>Owner</Button>
                </div>
              ) : null}
            </div>

            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3 ">
                <dt className="text-gray-500"> Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={findSubreddit.createdAt.toDateString()}>
                    {format(findSubreddit.createdAt, "MMMM dd, yyyy")}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount} members</div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
