
import React from 'react';
import { Product, User } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '2',
    farmerId: 'f2',
    farmerName: 'Sunshine Orchards',
    name: 'Golden Honey Apples',
    description: 'Sweet, crisp apples grown in the high altitudes for extra crunch and sweetness. 🍎 #AppleDay #HealthySnacks',
    price: 180.00,
    unit: 'kg',
    quantity: 120,
    category: 'Fruits',
    image: '/apples.jpg',
    rating: 4.5,
    reviews: [],
    likes: 87
  },
  {
    id: '1',
    farmerId: 'f1',
    farmerName: 'Green Valley Organic',
    name: 'Organic Red Tomatoes',
    description: 'Freshly harvested, vine-ripened organic tomatoes packed with flavor. Perfect for salads and sauces! 🍅 #Fresh #FarmToTable',
    price: 80.00,
    unit: 'kg',
    quantity: 50,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: [],
    likes: 124
  },
  {
    id: '4',
    farmerId: 'f1',
    farmerName: 'Green Valley Organic',
    name: 'Farm Fresh Potatoes',
    description: 'Earth-grown organic potatoes, perfect for mashing, frying, or baking. Directly from our fields! 🥔 #PotatoLove #OrganicRoots',
    price: 40.00,
    unit: 'kg',
    quantity: 200,
    category: 'Vegetables',
    image: '/potatoes.jpg',
    rating: 4.7,
    reviews: [],
    likes: 215
  },
  {
    id: '10',
    farmerId: 'f2',
    farmerName: 'Sunshine Orchards',
    name: 'Organic Sweet Bananas',
    description: 'Naturally ripened sweet bananas, full of energy and potassium. 🍌 #OrganicFruits #EnergyBoost',
    price: 60.00,
    unit: 'kg',
    quantity: 90,
    category: 'Fruits',
    image: '/bananas.jpg',
    rating: 4.8,
    reviews: [],
    likes: 154
  },
  {
    id: '5',
    farmerId: 'f2',
    farmerName: 'Sunshine Orchards',
    name: 'Farm Fresh Sweet Corn',
    description: 'Sweet, golden corn harvested at peak ripeness. Perfect for grilling or boiling! 🌽 #OrganicCorn #FarmFresh',
    price: 30.00,
    unit: 'piece',
    quantity: 500,
    category: 'Grains',
    image: '/corn.jpg',
    rating: 4.8,
    reviews: [],
    likes: 142
  },
  {
    id: '11',
    farmerId: 'f1',
    farmerName: 'Green Valley Organic',
    name: 'Premium Quinoa',
    description: 'High-protein ancient grain, grown organically and carefully harvested. Perfect for salads and bowls. 🥣 #Superfood #Quinoa',
    price: 450.00,
    unit: 'kg',
    quantity: 60,
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800', // Reusing a grain image
    rating: 4.9,
    reviews: [],
    likes: 182
  },
  {
    id: '12',
    farmerId: 'f1',
    farmerName: 'Green Valley Organic',
    name: 'Organic Baby Carrots',
    description: 'Crispy and sweet organic carrots, perfect for snacks or roasting. 🥕 #HealthSnacks #FarmerFresh',
    price: 60.00,
    unit: 'bunch',
    quantity: 100,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: [],
    likes: 98
  },
  {
    id: '13',
    farmerId: 'f2',
    farmerName: 'Sunshine Orchards',
    name: 'Fresh Strawberries',
    description: 'Juicy, hand-picked strawberries. Bright red and bursting with summer flavor. 🍓 #BerryGood #FreshPicked',
    price: 250.00,
    unit: 'box',
    quantity: 45,
    category: 'Fruits',
    image: '/strawberries.jpg',
    rating: 4.7,
    reviews: [],
    likes: 189
  },
  {
    id: '15',
    farmerId: 'f1',
    farmerName: 'Green Valley Organic',
    name: 'Wheat',
    description: 'Freshly harvested premium quality wheat grains. Perfect for stone-ground flour. 🌾',
    price: 85.00,
    unit: 'kg',
    quantity: 500,
    category: 'Grains',
    image: '/wheat.jpg',
    rating: 4.8,
    reviews: [],
    likes: 56
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'CONSUMER',
  avatar: 'https://i.pravatar.cc/150?u=u1'
};

export const MOCK_FARMER: User = {
  id: 'f1',
  name: 'Sarah Jenkins',
  email: 'sarah@farm.com',
  role: 'FARMER',
  avatar: 'https://i.pravatar.cc/150?u=f1'
};
