import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { User } from "@/lib/types";

interface UseUsersOptions {
  enabled?: boolean;
}

export const useUsers = (options?: UseUsersOptions) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/users");
      return response.data;
    },

    ...options,
    retry: 1,
  });
};
