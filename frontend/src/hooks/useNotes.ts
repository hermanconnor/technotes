import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { Note, PaginatedResponse } from "@/lib/types";

interface NoteParams {
  page?: number;
  limit?: number;
  search?: string;
  completed?: boolean;
  sort?: string;
}

export const useNotes = (params: NoteParams = { page: 1, limit: 10 }) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<PaginatedResponse<Note>>({
    // Add params to the queryKey so it refetches when page/search changes
    queryKey: ["notes", params],
    queryFn: async () => {
      const response = await axiosPrivate.get<PaginatedResponse<Note>>(
        "/notes",
        { params },
      );

      return response.data;
    },
    staleTime: 1000 * 60 * 3,
  });
};
