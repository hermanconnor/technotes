import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { DashboardStats } from "@/lib/types";

export const useDashboardStats = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response =
        await axiosPrivate.get<DashboardStats>("/stats/dashboard");

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
