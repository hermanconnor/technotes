import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 1 minute before background refetching triggers
      staleTime: 1000 * 60,
      // Retries failed requests 1 time before showing an error
      retry: 1,
      // Refetch data when the user refocuses the browser window
      refetchOnWindowFocus: true,
    },
  },
});
