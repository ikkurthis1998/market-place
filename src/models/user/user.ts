import { Schema, model } from "mongoose";
import { Address } from "./address";
import { Cart } from "../cart/cart";
import { Order } from "../order/order";
import { Product } from "../product/product";

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export enum UserType {
    GUEST = "GUEST",
    AUTHENTICATED = "AUTHENTICATED"
}

export type User = {
	_id: Schema.Types.ObjectId;
	email: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	orders: Order[];
	addresses: Address[];
	cart: Cart;
	wishList: Product[];
	status: string;
	type: string;
	createdAt: Date;
	updatedAt: Date;
};

const userSchema = new Schema<User>(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			match: [
				/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
				"Please enter a valid email"
			]
		},
		firstName: {
			type: String,
            required: true,
            trim: true
		},
		lastName: {
			type: String,
            required: true,
            trim: true
		},
		phone: {
			type: String,
			trim: true,
			unique: true,
			match: [
				/^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
				"Please enter a valid phone number"
			], // EPP format for phone number, +CCC.NNNNNNNNNNxEEEE
			set: (phone: string) => {
				return phone.replace(".", "").replace("x", "");
			}
		},
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: "Order",
				bind: true
			}
		],
		addresses: [
			{
				type: Schema.Types.ObjectId,
				ref: "Address",
				bind: true
			}
		],
		cart: {
			type: Schema.Types.ObjectId,
			ref: "Cart",
			bind: true
		},
		wishList: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
				bind: true
			}
		],
		status: {
			type: String,
			enum: Object.values(UserStatus),
			default: UserStatus.ACTIVE
		},
		type: {
			type: String,
            enum: Object.values(UserType),
            default: UserType.GUEST
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const user = model<User>("User", userSchema);
