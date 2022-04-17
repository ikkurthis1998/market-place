import { Schema, model } from "mongoose";
import { Invoice } from "./invoice";

export enum PaymentProvider {
    STRIPE = "STRIPE",
    PAYPAL = "PAYPAL",
    RAZORPAY = "RAZORPAY"
}

export enum PaymentStatus {
    INITIATED = "INITIATED",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export type Payment = {
	_id: Schema.Types.ObjectId;
	invoice: Invoice;
	paymentId: string;
	paymentLink: string;
	paymentProvider: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
};

const paymentSchema = new Schema<Payment>(
	{
		invoice: {
			type: Schema.Types.ObjectId,
			ref: "Invoice",
            required: true,
            bind: true
		},
		paymentId: {
			type: String,
			required: true
		},
		paymentLink: {
			type: String,
			required: true
		},
		paymentProvider: {
            type: String,
            enum: Object.values(PaymentProvider),
			default: PaymentProvider.RAZORPAY
		},
		status: {
			type: String,
			enum: Object.values(PaymentStatus),
			default: PaymentStatus.INITIATED
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const payment = model<Payment>("Payment", paymentSchema);
