"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderProductSchema = new mongoose_1.Schema({
    id: { type: mongoose_1.Schema.Types.Number, required: true },
    title: { type: mongoose_1.Schema.Types.String, required: true },
    description: { type: mongoose_1.Schema.Types.String, required: true },
    category: { type: mongoose_1.Schema.Types.String, required: true },
    image: { type: mongoose_1.Schema.Types.String, required: true },
    rating: mongoose_1.Schema.Types.Mixed,
    variations: [mongoose_1.Schema.Types.Mixed],
    size: { type: mongoose_1.Schema.Types.String, required: true },
    price: { type: mongoose_1.Schema.Types.Number, required: true },
    qty: { type: mongoose_1.Schema.Types.Number, required: true },
});
const orderUserSchema = new mongoose_1.Schema({
    name: { type: mongoose_1.Schema.Types.String, required: true },
    email: { type: mongoose_1.Schema.Types.String, required: true },
    address: {
        line1: { type: mongoose_1.Schema.Types.String, required: true },
        line2: mongoose_1.Schema.Types.String,
        city: { type: mongoose_1.Schema.Types.String, required: true },
        state: { type: mongoose_1.Schema.Types.String, required: true },
        postal_code: { type: mongoose_1.Schema.Types.String, required: true },
        country: { type: mongoose_1.Schema.Types.String, required: true },
    },
});
const orderSchema = new mongoose_1.Schema({
    user: { type: orderUserSchema, required: true },
    products: { type: [orderProductSchema], required: true },
    status: { type: mongoose_1.Schema.Types.String, required: true },
});
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
