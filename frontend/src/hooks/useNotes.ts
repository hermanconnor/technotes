import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { Note } from "@/lib/types";

export const useNotes = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/notes");
      return response.data;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};
