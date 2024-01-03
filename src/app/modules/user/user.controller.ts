import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.body;
    console.log(user);
    const result = await UserService.createUser(user);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  }
);
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
const findByUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const email = req.params.email;
    const result = await UserService.findByUser(email);

    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetch Success!',
      data: result,
    });
  }
);
export const UserController = {
  createUser,
  createPayment,
  findByUser,
};
