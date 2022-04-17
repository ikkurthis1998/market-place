import { Schema, model } from "mongoose";
import { Product } from "./product";

export enum TariffType {
    FIXED = "FIXED",
    PERCENTAGE = "RANGE"
}

export enum TariffStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export type Tariff = {
	_id: Schema.Types.ObjectId;
	currency: string;
	type?: string;
	minPrice?: number;
	maxPrice?: number;
	minQuantity?: number;
    maxQuantity?: number;
    price: {
        inclusive: number;
        exclusive: number;
        gst: number;
    };
	startDate?: Date;
	endDate?: Date;
	product: Product;
	status: string;
	createdAt: Date;
	updatedAt: Date;
};

const tariffSchema = new Schema<Tariff>(
	{
		currency: {
			type: String,
			default: "INR"
		},
		type: {
			type: String,
			enum: Object.values(TariffType),
			default: TariffType.FIXED
		},
		minPrice: {
			type: Number,
			required: false
		},
		maxPrice: {
			type: Number,
			required: false
		},
		minQuantity: {
			type: Number,
			required: false
		},
		maxQuantity: {
			type: Number,
			required: false
        },
        price: {
            inclusive: {
                type: Number,
                required: true
            },
            exclusive: {
                type: Number,
                required: true
            },
            gst: {
                type: Number,
                required: true
            }
        },
		startDate: {
			type: Date,
			required: false
		},
		endDate: {
			type: Date,
			required: false
		},
		product: {
			type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            bind: true
		},
		status: {
			type: String,
			enum: Object.values(TariffStatus),
			default: TariffStatus.ACTIVE
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const tariff = model<Tariff>("Tariff", tariffSchema);
