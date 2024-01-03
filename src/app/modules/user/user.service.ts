import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateUserId } from './user.utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(
  'sk_test_51MbbiGK3RZZOQUDyRQl4zzD9kSHU6weYV1wrxCkXxO94E4V5P8McJnOnGL1cXCaNf8TVouK23HMh97VwtbOlvX2700x2w8z7Qv'
);
const createUser = async (user: IUser): Promise<IUser | null> => {
  console.log(user);
  // If password is not given, set default password
  if (!user.password) {
    user.password = config.default_student_pass as string;
  }
  // Set role
  user.role = 'user';

  // Check if the email already exists
  const existingUser = await User.findOne({ email: user.email }).lean();

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
  }

  let newUserAllData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Generate student id
    const id = await generateUserId();

    // Set custom id into both student & user
    user.id = id;

    // Create student using session
    const newUser = await User.create([user], { session });

    if (!newUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    newUserAllData = newUser[0].toObject();
    const email = newUserAllData.email;
    const role = newUserAllData.role;
    const accessToken = jwtHelpers.createToken(
      { email, role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      { email, role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );
    newUserAllData.accessToken = accessToken;
    newUserAllData.refreshToken = refreshToken;
    console.log(newUser, newUserAllData);
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newUserAllData;
};
const createPayment = async ({
  amount,
  billing_details,
}: any): Promise<any | null> => {
  try {
    if (!billing_details.email) {
      throw new Error('Email address is required for receipt');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: 'Payment for Your Product or Service', // Update with a meaningful description
      payment_method_types: ['card'],
      receipt_email: billing_details.email,
      billing_details,
    });

    return paymentIntent;
  } catch (error) {
    console.error(error);

    if (error instanceof stripe.errors.StripeError) {
      // The stripe library itself handles specific Stripe errors
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to process payment');
    } else {
      // Handle other unexpected errors
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to process payment'
      );
    }
  }
};
const findByUser = async (email: string): Promise<any | null> => {
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to find User');
    }
    return user;
  } catch (error) {
    console.error(error);

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to User');
  }
};
// const storeOrder=async({}) => {
//   try {
//     const { user, product, status } = req.body;

//     // Store order details in your database or perform any necessary actions
//     // Example: Save to MongoDB
//     // await Order.create({ user, product, status });

//     res.status(200).json({ message: 'Order details stored successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
export const UserService = {
  createUser,
  createPayment,
  findByUser,
};
