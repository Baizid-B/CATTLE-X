const mockTestimonials = [
  {
    id: "1",
    name: "রহিম উদ্দিন",
    location: "ঢাকা",
    text: "এই প্ল্যাটফর্মে গরু কিনে খুবই সন্তুষ্ট। দাম সঠিক ছিল এবং বিক্রেতা বিশ্বস্ত।",
    rating: 5,
    enabled: true,
    sort_order: 1,
  },
  {
    id: "2",
    name: "করিম সাহেব",
    location: "চট্টগ্রাম",
    text: "খুব ভালো অভিজ্ঞতা। ছবি দেখে গরু কিনেছি, সবকিছু হুবহু মিলেছে।",
    rating: 5,
    enabled: true,
    sort_order: 2,
  },
  {
    id: "3",
    name: "সুমাইয়া বেগম",
    location: "রাজশাহী",
    text: "দ্রুত সেবা এবং সৎ বিক্রেতা পেয়েছি। পরের বার ও এখানেই কিনব।",
    rating: 4,
    enabled: true,
    sort_order: 3,
  },
];

export const useTestimonials = () => {
  return {
    data: mockTestimonials,
    isLoading: false,
    error: null,
  };
};
