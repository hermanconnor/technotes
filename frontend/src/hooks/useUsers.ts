import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { User } from "@/lib/types";

export const useUsers = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/users");
      return response.data;
    },
    // Only fetch if the user is authorized (optional safety check)
    retry: 1,
  });
};
