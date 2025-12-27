export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export const WHATSAPP_NUMBER = "97433824737"; // Store owner's number