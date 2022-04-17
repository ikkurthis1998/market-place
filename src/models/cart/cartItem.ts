import { Schema, model } from "mongoose";
import { Product } from "../product/product";

export enum CartItemStatus {
    ACTIVE = "ACTIVE",
    REMOVED = "REMOVED",
    MOVED_TO_ORDER = "MOVED_TO_ORDER"
}

export type CartItem = {
	_id: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	product: Product;
	quantity: number;
	amount: number;
	currency: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
};

const cartItemSchema = new Schema<CartItem>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
            required: true,
            bind: true
		},
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
			enum: Object.values(CartItemStatus),
			default: CartItemStatus.ACTIVE
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const cartItem = model<CartItem>("CartItem", cartItemSchema);
