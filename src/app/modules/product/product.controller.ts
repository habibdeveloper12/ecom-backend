import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import { UserService } from './product.service';

const createPayment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { amount, billing_details } = req.body;
    const result = await UserService.createPayment({ amount, billing_details });
    if (result.paymentIntent) {
      res
        .status(200)
        .json({ client_secret: result.paymentIntent.client_secret });
    }
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  }
);
const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { amount, billing_details } = req.body;
    const result = await UserService.createPayment({ amount, billing_details });
    if (result.paymentIntent) {
      res
        .status(200)
        .json({ client_secret: result.paymentIntent.client_secret });
    }
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  }
);

export const ProductController = {
  createPayment,
  createOrder,
};
