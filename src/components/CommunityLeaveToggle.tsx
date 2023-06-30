"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToasts } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CommunityLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const CommunityLeaveToggle: FC<CommunityLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const router = useRouter();
  const { loginToast } = useCustomToasts();
  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Sorry, we couldn't subscribe you to this subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        title: "Subscribed",
        description: `You are now subscribed to ${subredditName}.`,
      });
    },
  });

  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4"> Leave Community</Button>
  ) : (
    <Button
      className=" w-full mt-1 mb-4"
      onClick={() => subscribe}
      isLoading={isSubLoading}
    >
      Join Community
    </Button>
  );
};

export default CommunityLeaveToggle;
