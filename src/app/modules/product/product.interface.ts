/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  id?: string;
  role?: string;
  password: string;
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'email' | 'name'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
