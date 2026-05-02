import { cows as mockCows, priceHistory, currentPrice } from "@/data/mockData";

export const useCows = () => {
  return {
    data: mockCows,
    isLoading: false,
    error: null,
  };
};

export const usePriceIndex = () => {
  const priceIndexData = priceHistory.map((p, i) => ({
    id: String(i),
    date: p.date,
    price: p.price,
    change_percent: p.change,
  }));
  return {
    data: priceIndexData,
    isLoading: false,
    error: null,
  };
};
