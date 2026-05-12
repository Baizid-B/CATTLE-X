import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/services/api";

// Types
export interface Cow {
  id: string;
  _id?: string;
  title: string;
  breed: string;
  weight: number;
  age: string;
  price: number;
  location: string;
  seller_name: string;
  health: string;
  description: string;
  featured: boolean;
  verified: boolean;
  images: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PriceData {
  id: string;
  _id?: string;
  date: string;
  price: number;
  change_percent: number;
  mode?: string;
}

interface SmartPriceResult {
  newPrice: number;
  changePercent: number;
  factors?: {
    timeBasedChange: number;
    randomVariation: number;
    eidEffect: number;
  };
}

// Custom hook for cows data
export const useCows = () => {
  const queryClient = useQueryClient();

  const {
    data: cows,
    isLoading,
    error,
    refetch,
  }: UseQueryResult<Cow[], Error> = useQuery({
    queryKey: ["cows"],
    queryFn: async () => {
      try {
        const response = await api.getCows();
        // Transform MongoDB _id to id for consistency
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedCows = response.map((cow: any) => ({
          ...cow,
          id: cow._id || cow.id,
        }));
        return transformedCows;
      } catch (err) {
        console.error("Failed to fetch cows:", err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add cow mutation
  const addCowMutation = useMutation({
    mutationFn: async (cowData: Omit<Cow, "id">) => {
      const response = await api.addCow(cowData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });

  // Update cow mutation
  const updateCowMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Cow> }) => {
      const response = await api.updateCow(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });

  // Delete cow mutation
  const deleteCowMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.deleteCow(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const response = await api.toggleFeatured(id, featured);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cows"] });
    },
  });

  return {
    data: cows || [],
    isLoading,
    error,
    refetch,
    addCow: addCowMutation.mutate,
    addCowAsync: addCowMutation.mutateAsync,
    updateCow: updateCowMutation.mutate,
    updateCowAsync: updateCowMutation.mutateAsync,
    deleteCow: deleteCowMutation.mutate,
    deleteCowAsync: deleteCowMutation.mutateAsync,
    toggleFeatured: toggleFeaturedMutation.mutate,
    toggleFeaturedAsync: toggleFeaturedMutation.mutateAsync,
    isAdding: addCowMutation.isPending,
    isUpdating: updateCowMutation.isPending,
    isDeleting: deleteCowMutation.isPending,
  };
};

// Custom hook for price index
export const usePriceIndex = () => {
  const queryClient = useQueryClient();

  const {
    data: priceData,
    isLoading,
    error,
    refetch,
  }: UseQueryResult<PriceData[], Error> = useQuery({
    queryKey: ["price_index"],
    queryFn: async () => {
      try {
        const response = await api.getPriceIndex();
        // Transform MongoDB _id to id for consistency
        const transformedData = response.map((item: any) => ({
          id: item._id || item.id,
          date: item.date,
          price: item.price,
          change_percent: item.change_percent,
          mode: item.mode || "manual",
        }));
        return transformedData;
      } catch (err) {
        console.error("Failed to fetch price index:", err);
        throw err;
      }
    },
    staleTime: 60 * 1000, // 1 minute - price changes frequently
  });

  // Add new price mutation
  const addPriceMutation = useMutation({
    mutationFn: async ({ price, change_percent, mode }: { price: number; change_percent: number; mode: string }) => {
      const response = await api.addPrice({ price, change_percent, mode });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price_index"] });
    },
  });

  // Smart price mutation
  const smartPriceMutation = useMutation({
    mutationFn: async (): Promise<SmartPriceResult> => {
      const response = await api.getSmartPrice();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price_index"] });
    },
  });

  // Get latest price
  const getLatestPrice = (): PriceData | null => {
    if (!priceData || priceData.length === 0) return null;
    return priceData[priceData.length - 1];
  };

  // Get price trend (positive, negative, neutral)
  const getPriceTrend = (): "up" | "down" | "neutral" => {
    const latest = getLatestPrice();
    if (!latest) return "neutral";
    if (latest.change_percent > 0) return "up";
    if (latest.change_percent < 0) return "down";
    return "neutral";
  };

  return {
    data: priceData || [],
    isLoading,
    error,
    refetch,
    addPrice: addPriceMutation.mutate,
    addPriceAsync: addPriceMutation.mutateAsync,
    smartPrice: smartPriceMutation.mutate,
    smartPriceAsync: smartPriceMutation.mutateAsync,
    isAddingPrice: addPriceMutation.isPending,
    isSmartPricing: smartPriceMutation.isPending,
    smartResult: smartPriceMutation.data,
    getLatestPrice,
    getPriceTrend,
  };
};

// Custom hook for single cow
export const useCow = (id: string) => {
  const { data: cows, isLoading } = useCows();
  
  const cow = cows?.find((c: Cow) => c.id === id || c._id === id);
  
  return {
    data: cow,
    isLoading,
    error: null,
  };
};

// Utility functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatWeight = (weight: number): string => {
  return `${weight} কেজি`;
};

export const getPriceChangeColor = (changePercent: number): string => {
  if (changePercent > 0) return "text-green-600";
  if (changePercent < 0) return "text-red-600";
  return "text-gray-600";
};

export const getPriceChangeSymbol = (changePercent: number): string => {
  if (changePercent > 0) return "↑";
  if (changePercent < 0) return "↓";
  return "→";
};