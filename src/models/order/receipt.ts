import { Schema, model } from "mongoose";
import { Order } from "./order";

export enum ReceiptStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export type Receipt = {
	_id: Schema.Types.ObjectId;
	order: Order;
	currency: string;
    totalAmount: number;
    amountSplit: {
        exclusive: number;
        cgst: number;
        sgst: number;
        igst: number;
    };
	status: string;
	createdAt: Date;
	updatedAt: Date;
};

const receiptSchema = new Schema<Receipt>(
	{
		order: {
			type: Schema.Types.ObjectId,
			ref: "Order",
            required: true,
            bind: true
		},
		totalAmount: {
			type: Number,
			required: true
        },
        amountSplit: {
            exclusive: {
                type: Number,
                required: true
            },
            cgst: {
                type: Number,
                required: true
            },
            sgst: {
                type: Number,
                required: true
            },
            igst: {
                type: Number,
                required: true
            }
        },
		currency: {
			type: String,
			default: "INR"
		},
		status: {
			type: String,
			enum: Object.values(ReceiptStatus),
			default: ReceiptStatus.ACTIVE
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const receipt = model<Receipt>("Receipt", receiptSchema);
