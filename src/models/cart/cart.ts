import { Schema, model } from "mongoose";
import { CartItem } from "./cartItem";

export type Cart = {
	_id: Schema.Types.ObjectId;
	user: Schema.Types.ObjectId;
	items: CartItem[];
	totalItems: number;
	totalAmount: number;
	createdAt: Date;
	updatedAt: Date;
};

const cartSchema = new Schema<Cart>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
            required: true,
            bind: true,
            unique: true
		},
		items: [
			{
				type: Schema.Types.ObjectId,
				ref: "CartItem",
                required: true,
                bind: true
			}
		],
		totalItems: {
			type: Number,
			required: true
		},
		totalAmount: {
			type: Number,
			required: true
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const cart = model<Cart>("Cart", cartSchema);
