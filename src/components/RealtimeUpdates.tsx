import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const RealtimeUpdates: React.FC = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const campaignSubscription = supabase
      .channel("campaigns-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "campaigns",
        },
        (payload) => {
          console.log("Campaign change detected:", payload);

          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
          queryClient.invalidateQueries({ queryKey: ["user-campaigns"] });

          if (
            payload.eventType === "UPDATE" ||
            payload.eventType === "INSERT"
          ) {
            queryClient.invalidateQueries({
              queryKey: ["campaign", payload.new.id],
            });
          }
        }
      )
      .subscribe();

    const donationSubscription = supabase
      .channel("donations-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "donations",
        },
        (payload) => {
          console.log("New donation detected:", payload);

          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
          queryClient.invalidateQueries({
            queryKey: ["campaign", payload.new.campaign_id],
          });
          queryClient.invalidateQueries({ queryKey: ["donations"] });
          queryClient.invalidateQueries({ queryKey: ["recent-donations"] });
          queryClient.invalidateQueries({ queryKey: ["user-campaigns"] });

          toast.success(
            `New donation of ${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(payload.new.amount)} received! 💝`,
            {
              duration: 5000,
              icon: "🎉",
            }
          );
        }
      )
      .subscribe();

    return () => {
      campaignSubscription.unsubscribe();
      donationSubscription.unsubscribe();
    };
  }, [queryClient]);

  return null;
};

export default RealtimeUpdates;
