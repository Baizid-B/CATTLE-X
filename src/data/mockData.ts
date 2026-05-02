export const priceHistory = [
  { date: "Mar 1", price: 520, change: 0 },
  { date: "Mar 5", price: 535, change: 2.9 },
  { date: "Mar 9", price: 528, change: -1.3 },
  { date: "Mar 13", price: 545, change: 3.2 },
  { date: "Mar 17", price: 560, change: 2.8 },
  { date: "Mar 20", price: 555, change: -0.9 },
  { date: "Mar 23", price: 568, change: 2.3 },
  { date: "Mar 26", price: 575, change: 1.2 },
  { date: "Mar 29", price: 580, change: 0.9 },
];

export const currentPrice = {
  price: 580,
  change: 12,
  changePercent: 2.1,
  direction: "up" as const,
};

export interface Cow {
  id: string;
  title: string;
  breed: string;
  weight: number;
  age: string;
  price: number;
  location: string;
  images: string[];
  seller: string;
  verified: boolean;
  featured: boolean;
  health: string;
  description: string;
}

export const cows: Cow[] = [
  {
    id: "1",
    title: "Premium Shahiwal Bull",
    breed: "Shahiwal",
    weight: 320,
    age: "3 years",
    price: 185000,
    location: "Dhaka",
    images: ["/placeholder.svg"],
    seller: "Rahman Farms",
    verified: true,
    featured: true,
    health: "Excellent",
    description: "A premium Shahiwal bull with excellent lineage. Well-fed and maintained with regular veterinary checkups.",
  },
  {
    id: "2",
    title: "Red Sindhi Cow",
    breed: "Red Sindhi",
    weight: 280,
    age: "4 years",
    price: 145000,
    location: "Chittagong",
    images: ["/placeholder.svg"],
    seller: "Karim Cattle",
    verified: true,
    featured: true,
    health: "Good",
    description: "Healthy Red Sindhi cow, great for dairy and breeding purposes.",
  },
  {
    id: "3",
    title: "Australian Friesian Cross",
    breed: "Friesian Cross",
    weight: 450,
    age: "2.5 years",
    price: 280000,
    location: "Rajshahi",
    images: ["/placeholder.svg"],
    seller: "Elite Livestock",
    verified: true,
    featured: true,
    health: "Excellent",
    description: "Top-grade Friesian cross, imported breed with high milk yield potential.",
  },
  {
    id: "4",
    title: "Brahman Bull",
    breed: "Brahman",
    weight: 380,
    age: "3.5 years",
    price: 220000,
    location: "Sylhet",
    images: ["/placeholder.svg"],
    seller: "Hasan Agro",
    verified: false,
    featured: false,
    health: "Good",
    description: "Strong Brahman bull suitable for Qurbani or breeding.",
  },
  {
    id: "5",
    title: "Local Deshi Bull",
    breed: "Deshi",
    weight: 250,
    age: "4 years",
    price: 95000,
    location: "Khulna",
    images: ["/placeholder.svg"],
    seller: "Village Farm",
    verified: false,
    featured: false,
    health: "Good",
    description: "Well-maintained local breed bull, organically raised.",
  },
  {
    id: "6",
    title: "Jersey Cross Heifer",
    breed: "Jersey Cross",
    weight: 300,
    age: "2 years",
    price: 165000,
    location: "Mymensingh",
    images: ["/placeholder.svg"],
    seller: "Dairy Best",
    verified: true,
    featured: false,
    health: "Excellent",
    description: "Young Jersey cross heifer with high dairy potential.",
  },
];

export const breeds = ["All", "Shahiwal", "Red Sindhi", "Friesian Cross", "Brahman", "Deshi", "Jersey Cross"];
export const locations = ["All", "Dhaka", "Chittagong", "Rajshahi", "Sylhet", "Khulna", "Mymensingh"];
