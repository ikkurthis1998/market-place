import { Schema, model } from "mongoose";

export enum RefundStatus {
	INITIATED = "INITIATED",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export type Refund = {
	_id: Schema.Types.ObjectId;
	refundNumber: string;
	order: Schema.Types.ObjectId;
	refundId: string;
	status: string;
	amount: number;
	currency: string;
	reason: string;
	createdAt: Date;
	updatedAt: Date;
};

const refundSchema = new Schema<Refund>(
	{
		order: {
			type: Schema.Types.ObjectId,
			ref: "Order",
            required: true,
            bind: true
		},
		refundNumber: {
			type: String,
			required: true,
            unique: true,
            trim: true
		},
		refundId: {
			type: String,
            required: true,
            unique: true,
            trim: true
		},
		status: {
			type: String,
			enum: Object.values(RefundStatus),
			default: RefundStatus.INITIATED
		},
		amount: {
			type: Number,
			required: true
		},
		currency: {
			type: String,
			default: "INR"
		},
		reason: {
			type: String,
            required: true,
            trim: true
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const refund = model<Refund>("Refund", refundSchema);
