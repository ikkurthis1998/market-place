import { Schema, model } from "mongoose";
import { Address } from "../user/address";
import { Order } from "./order";

export enum ShippingType {
    STANDARD = "STANDARD",
    EXPRESS = "EXPRESS"
}

export enum ShippingStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export type Shipping = {
	_id: Schema.Types.ObjectId;
	type: string;
	shippingAddress: Address;
	cost?: number;
	currency?: string;
	provider?: string;
	shipmentId?: string;
	awb?: string;
	dispatchDate?: Date;
	itemId?: string;
	status: string;
	order: Order;
	createdAt: Date;
	updatedAt: Date;
};

const shippingSchema = new Schema(
	{
		type: {
			type: String,
			enum: Object.values(ShippingType),
			default: ShippingType.STANDARD
		},
		shippingAddress: {
			type: Schema.Types.ObjectId,
			ref: "Address",
            required: true,
            bind: true
		},
		cost: {
			type: Number,
			default: 0
		},
		currency: {
			type: String,
			default: "INR"
		},
		provider: {
			type: String
		},
		shipmentId: {
			type: String
		},
		awb: {
			type: String
		},
		dispatchDate: {
			type: Date
		},
		itemId: {
			type: String
		},
		status: {
			type: String,
			enum: Object.values(ShippingStatus),
			default: ShippingStatus.ACTIVE
		},
		order: {
			type: Schema.Types.ObjectId,
			ref: "Order",
            required: true,
            bind: true
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const shipping = model<Shipping>("Shipping", shippingSchema);
