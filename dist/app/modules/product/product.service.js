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
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')('sk_test_51MbbiGK3RZZOQUDyRQl4zzD9kSHU6weYV1wrxCkXxO94E4V5P8McJnOnGL1cXCaNf8TVouK23HMh97VwtbOlvX2700x2w8z7Qv');
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
const createOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const asad = 'df';
    console.log(asad);
});
exports.UserService = {
    createPayment,
    createOrder,
};
