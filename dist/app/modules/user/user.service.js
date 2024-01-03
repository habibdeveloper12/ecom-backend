"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../../../config/index"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')('sk_test_51MbbiGK3RZZOQUDyRQl4zzD9kSHU6weYV1wrxCkXxO94E4V5P8McJnOnGL1cXCaNf8TVouK23HMh97VwtbOlvX2700x2w8z7Qv');
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user);
    // If password is not given, set default password
    if (!user.password) {
        user.password = index_1.default.default_student_pass;
    }
    // Set role
    user.role = 'user';
    // Check if the email already exists
    const existingUser = yield user_model_1.User.findOne({ email: user.email }).lean();
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already exists');
    }
    let newUserAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Generate student id
        const id = yield (0, user_utils_1.generateUserId)();
        // Set custom id into both student & user
        user.id = id;
        // Create student using session
        const newUser = yield user_model_1.User.create([user], { session });
        if (!newUser) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create User');
        }
        newUserAllData = newUser[0].toObject();
        const email = newUserAllData.email;
        const role = newUserAllData.role;
        const accessToken = jwtHelpers_1.jwtHelpers.createToken({ email, role }, index_1.default.jwt.secret, index_1.default.jwt.expires_in);
        const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ email, role }, index_1.default.jwt.refresh_secret, index_1.default.jwt.refresh_expires_in);
        newUserAllData.accessToken = accessToken;
        newUserAllData.refreshToken = refreshToken;
        console.log(newUser, newUserAllData);
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return newUserAllData;
});
const createPayment = ({ amount, billing_details, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!billing_details.email) {
            throw new Error('Email address is required for receipt');
        }
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            description: 'Payment for Your Product or Service',
            payment_method_types: ['card'],
            receipt_email: billing_details.email,
            billing_details,
        });
        return paymentIntent;
    }
    catch (error) {
        console.error(error);
        if (error instanceof stripe.errors.StripeError) {
            // The stripe library itself handles specific Stripe errors
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to process payment');
        }
        else {
            // Handle other unexpected errors
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to process payment');
        }
    }
});
const findByUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findOne({ email });
        console.log(user);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to find User');
        }
        return user;
    }
    catch (error) {
        console.error(error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to User');
    }
});
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
exports.UserService = {
    createUser,
    createPayment,
    findByUser,
};
