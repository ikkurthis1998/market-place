import { Schema, model } from "mongoose";
import { User } from "./user";

export enum AddressStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export type Address = {
	_id: Schema.Types.ObjectId;
	firstName: string;
	lastName: string;
	phone: string;
	address1: string;
	address2: string;
	landmark: string;
	city: string;
	state: string;
	stateGstCode: string;
	postalCode: string;
	country: string;
	user: User;
	status: string;
};

const addressSchema = new Schema(
	{
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
            required: true,
            trim: true,
            match: [
				/^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
				"Please enter a valid phone number"
			], // EPP format for phone number, +CCC.NNNNNNNNNNxEEEE
			set: (phone: string) => {
				return phone.replace(".", "").replace("x", "");
			}
		},
		address1: {
			type: String,
            required: true,
            trim: true
		},
		address2: {
			type: String,
            required: false,
            trim: true
		},
		landmark: {
            type: String,
            required: false,
            trim: true
		},
		city: {
			type: String,
            required: true,
            trim: true
		},
		state: {
			type: String,
            required: true,
            trim: true
		},
		stateGstCode: {
			type: String,
            required: true,
            trim: true
		},
		postalCode: {
			type: String,
            required: true,
            trim: true
		},
		country: {
			type: String,
            default: "India",
            trim: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
            required: true,
            bind: true
		},
		status: {
			type: String,
			enum: Object.values(AddressStatus),
			default: AddressStatus.ACTIVE
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const address = model<Address>("Address", addressSchema);
