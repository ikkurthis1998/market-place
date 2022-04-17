import { Schema, model } from "mongoose";
import { Order } from "../order/order";
import { User } from "../user/user";
import { Payment } from "./payment";

export enum InvoiceStatus {
    INVOICE_CREATED = "INVOICE_CREATED",
    PAYMENT_INITIATED = "PAYMENT_INITIATED",
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
    PAYMENT_FAILED = "PAYMENT_FAILED"
}

export type Invoice = {
	_id: Schema.Types.ObjectId;
	invoiceNumber: string;
	orders: Order[];
	payment: Payment;
	currency: string;
	totalAmount: number;
	totalQuantity: number;
	gstin: string;
	user: User;
	status: string;
	createdAt: Date;
	updatedAt: Date;
};

const invoiceSchema = new Schema<Invoice>(
	{
		invoiceNumber: {
			type: String,
			required: true,
			unique: true,
			trim: true
		},
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: "Order",
				required: true,
				bind: true
			}
		],
		payment: {
			type: Schema.Types.ObjectId,
			ref: "Payment",
			bind: true
		},
		currency: {
			type: String,
			default: "INR"
		},
		totalAmount: {
			type: Number,
			required: true
		},
		totalQuantity: {
			type: Number,
			required: true
		},
		gstin: {
			type: String,
			required: false
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
            required: true,
            bind: true
		},
		status: {
			type: String,
			enum: Object.values(InvoiceStatus),
			default: InvoiceStatus.INVOICE_CREATED
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const invoice = model<Invoice>("Invoice", invoiceSchema);
