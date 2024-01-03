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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const order_model_1 = __importDefault(require("./app/modules/order/order.model"));
const routes_1 = __importDefault(require("./app/routes"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')('sk_test_51MbbiGK3RZZOQUDyRQl4zzD9kSHU6weYV1wrxCkXxO94E4V5P8McJnOnGL1cXCaNf8TVouK23HMh97VwtbOlvX2700x2w8z7Qv');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use('/api/v1/users/', UserRoutes);
// app.use('/api/v1/academic-semesters', AcademicSemesterRoutes);
app.use('/api/v1', routes_1.default);
app.post('/api/v1/users/payment-intent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        // Create a payment intent
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            description: 'Payment for Order',
            payment_method_types: ['card'],
        });
        res.status(200).json({ client_secret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.post('/api/v1/store-order', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const orderInstance = new order_model_1.default(sampleOrderData);
        orderInstance
            .save()
            .then(savedOrder => {
            console.log('Order saved:', savedOrder);
        })
            .catch(err => {
            console.error(err);
        });
        res.status(200).json({ message: 'Order details stored successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
//Testing
// app.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   throw new Error('Testing Error logger')
// })
//global error handler
app.use(globalErrorHandler_1.default);
//handle not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
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
exports.default = app;
