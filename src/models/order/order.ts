import { Schema, model } from "mongoose";
import { Address } from "../user/address";
import { Product } from "../product/product";
import { User } from "../user/user";
import { Receipt } from "./receipt";
import { Shipping, ShippingStatus } from "./shipping";
import { Invoice } from "../invoice/invoice";
import { Refund } from "./refund";

export enum OrderStatus {
	INVOICE_PENDING = "INVOICE_PENDING",
	PAYMENT_PENDING = "PAYMENT_PENDING",
	CONFIRMED = "CONFIRMED",
	DISPATCH_CREATED = "DISPATCH_CREATED",
	DISPATCH_PICKED_UP = "DISPATCH_PICKED_UP",
	IN_TRANSIT = "IN_TRANSIT",
	DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    RETURN_REQUESTED = "RETURN_REQUESTED",
    RETURN_REJECTED = "RETURN_REJECTED",
    RETURN_ACCEPTED = "RETURN_ACCEPTED",
    RETURN_IN_TRANSIT = "RETURN_IN_TRANSIT",
    RETURN_DELIVERED = "RETURN_DELIVERED",
    RETURN_CANCELLED = "RETURN_CANCELLED",
    REPLACEMENT_REQUESTED = "REPLACEMENT_REQUESTED",
    REPLACEMENT_REJECTED = "REPLACEMENT_REJECTED",
    REPLACEMENT_ACCEPTED = "REPLACEMENT_ACCEPTED",
    REPLACEMENT_IN_TRANSIT = "REPLACEMENT_IN_TRANSIT",
    REPLACEMENT_DELIVERED = "REPLACEMENT_DELIVERED",
    REPLACEMENT_CANCELLED = "REPLACEMENT_CANCELLED"
}

export type Order = {
	_id: Schema.Types.ObjectId;
	product: Product;
	quantity: number;
	amount: number;
	currency: string;
	status: string;
	user: User;
	receipt: Receipt;
	billingAddress: Address;
	shippings: Shipping[];
	trackingId: string;
	invoice: Invoice;
	refund: Refund;
	createdAt: Date;
	updatedAt: Date;
};

const orderSchema = new Schema<Order>(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: "Product",
            required: true,
            bind: true
		},
		quantity: {
			type: Number,
			required: true
		},
		amount: {
			type: Number,
			required: true
		},
		currency: {
			type: String,
			default: "INR"
		},
		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.INVOICE_PENDING
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
            required: true,
            bind: true
		},
		receipt: {
			type: Schema.Types.ObjectId,
			ref: "Receipt",
            required: false,
            bind: true
		},
		billingAddress: {
			type: Schema.Types.ObjectId,
			ref: "Address",
            required: true,
            bind: true
		},
		shippings: [
			{
				type: Schema.Types.ObjectId,
				ref: "Shipping",
                required: true,
                bind: true,
                populate: {
                    path: "shippings",
                    match: {
                        status: ShippingStatus.ACTIVE
                    }
                }
			}
		],
		trackingId: {
			type: String,
			required: true
		},
		invoice: {
			type: Schema.Types.ObjectId,
            ref: "Invoice",
            bind: true
		},
		refund: {
			type: Schema.Types.ObjectId,
            ref: "Refund",
            bind: true
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const order = model<Order>("Order", orderSchema);
