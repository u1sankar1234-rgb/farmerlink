
export type UserRole = 'FARMER' | 'CONSUMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  location?: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  category: string;
  image: string;
  rating: number;
  reviews: Review[];
  likes: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isReported?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface Order {
  id: string;
  consumerId: string;
  farmerId: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  date: string;
  address: string;
  phone: string;
  hasFeedback: boolean;
  trackingNumber?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'ORDER' | 'MESSAGE' | 'SYSTEM';
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface AppState {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
}
