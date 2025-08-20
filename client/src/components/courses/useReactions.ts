import { useState, useEffect, useCallback } from "react";
import type { ReactionDto } from "../../models/reactions/ReactionDto";
import { reactionsApi } from "../../api_services/reactions/ReactionsAPIService";

export function useReactions(announcementId: number, token: string | null) {
  const [reactions, setReactions] = useState<ReactionDto[]>([]);

  const fetchReactions = useCallback(async () => {
    console.log("[useReactions] fetchReactions called", { announcementId, token });
    if (!token) {
      console.warn("[useReactions] Token nedostupan, prekid fetch-a");
      return;
    }
    try {
      const res = await reactionsApi.getByAnnouncement(announcementId, token);
      console.log("[useReactions] Reactions fetched", res);
      setReactions(res);
    } catch (error) {
      console.error("[useReactions] Greška pri učitavanju reakcija:", error);
    }
  }, [announcementId, token]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const toggleReaction = async (userId: number, type: "lajk" | "dislajk") => {
    console.log("[useReactions] toggleReaction called", { userId, type, token });
    if (!token || !userId) {
      console.warn("[useReactions] Token ili userId nedostupan, prekid toggle-a");
      return;
    }
    try {
      await reactionsApi.toggleReaction(announcementId, userId, type, token);
      fetchReactions();
    } catch (error) {
      console.error("[useReactions] Greška pri togglovanju reakcije:", error);
    }
  };

  return { reactions, toggleReaction };
}
