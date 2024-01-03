import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import Order from './app/modules/order/order.model';
import routes from './app/routes';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(
  'sk_test_51MbbiGK3RZZOQUDyRQl4zzD9kSHU6weYV1wrxCkXxO94E4V5P8McJnOnGL1cXCaNf8TVouK23HMh97VwtbOlvX2700x2w8z7Qv'
);

const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api/v1/users/', UserRoutes);
// app.use('/api/v1/academic-semesters', AcademicSemesterRoutes);
app.use('/api/v1', routes);

app.post('/api/v1/users/payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // Change to your desired currency
      description: 'Payment for Order',
      payment_method_types: ['card'],
    });

    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/v1/store-order', async (req, res) => {
  try {
    const user = req.body;
    const products = req.body;
    const status = req.body;

    console.log(user, products, status);

    const sampleOrderData = {
      user,
      products,
      status,
    };

    const orderInstance = new Order(sampleOrderData);

    orderInstance
      .save()
      .then(savedOrder => {
        console.log('Order saved:', savedOrder);
      })
      .catch(err => {
        console.error(err);
      });

    res.status(200).json({ message: 'Order details stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Testing
// app.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   throw new Error('Testing Error logger')
// })

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
