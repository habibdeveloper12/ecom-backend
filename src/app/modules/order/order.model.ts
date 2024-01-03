import mongoose, { Schema } from 'mongoose';
import { IOrder, IOrderProduct, IOrderUser } from './order.interface';
const orderProductSchema = new Schema<IOrderProduct>({
  id: { type: Schema.Types.Number, required: true },
  title: { type: Schema.Types.String, required: true },
  description: { type: Schema.Types.String, required: true },
  category: { type: Schema.Types.String, required: true },
  image: { type: Schema.Types.String, required: true },
  rating: Schema.Types.Mixed, // Adjust the type accordingly
  variations: [Schema.Types.Mixed], // Adjust the type accordingly
  size: { type: Schema.Types.String, required: true },
  price: { type: Schema.Types.Number, required: true },
  qty: { type: Schema.Types.Number, required: true },
});

const orderUserSchema = new Schema<IOrderUser>({
  name: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true },
  address: {
    line1: { type: Schema.Types.String, required: true },
    line2: Schema.Types.String,
    city: { type: Schema.Types.String, required: true },
    state: { type: Schema.Types.String, required: true },
    postal_code: { type: Schema.Types.String, required: true },
    country: { type: Schema.Types.String, required: true },
  },
});

const orderSchema = new Schema<IOrder>({
  user: { type: orderUserSchema, required: true },
  products: { type: [orderProductSchema], required: true },
  status: { type: Schema.Types.String, required: true },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
