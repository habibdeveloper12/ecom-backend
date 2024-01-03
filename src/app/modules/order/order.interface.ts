/* eslint-disable no-unused-vars */

export type IOrderProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  rating: any; // Assuming you have a specific type for ratings
  variations: any[]; // Assuming you have a specific type for variations
  size: string;
  price: number;
  qty: number;
};

export type IOrderUser = {
  name: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

export type IOrder = {
  user: IOrderUser;
  products: IOrderProduct[];
  status: string;
} & Document;
