import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";

export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};

// Custom hook untuk SWR yang menangani navigasi dengan Link
export const useSWRWithNavigation = <T>(
  key: string | null,
  fetcher: (key: string) => Promise<T>,
  options?: any
) => {
  const pathname = usePathname();

  const swrKey = key ? [key, pathname] : null;

  const result = useSWR(swrKey, ([token]) => fetcher(token), {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    ...options,
  });

  // Force re-fetch when pathname changes (navigation via Link)
  useEffect(() => {
    if (key && result.mutate) {
      result.mutate();
    }
  }, [pathname, key, result.mutate]);

  return result;
};
