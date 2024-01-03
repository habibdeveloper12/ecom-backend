import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(
  'sk_test_51MbbiGK3RZZOQUDyRQl4zzD9kSHU6weYV1wrxCkXxO94E4V5P8McJnOnGL1cXCaNf8TVouK23HMh97VwtbOlvX2700x2w8z7Qv'
);

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
const createOrder = async () => {
  const asad = 'df';
  console.log(asad);
};
export const UserService = {
  createPayment,
  createOrder,
};
