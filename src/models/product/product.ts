import { Schema, model } from "mongoose";
import { Image } from "../image";
import { Tariff } from "./tariff";

export enum ProductStatus {
    OUT_OF_STOCK = "OUT_OF_STOCK",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export type Product = {
	_id: Schema.Types.ObjectId;
	name: string;
	modelId: string;
	hsn_sac: string;
	sku: string;
	tariffs?: Tariff[];
	description: string;
	images?: Image[];
	category: string[];
	quantity: number;
	status: string;
	createdAt: Date;
	updatedAt: Date;
};

const productSchema = new Schema<Product>(
	{
		name: {
			type: String,
            required: true,
            trim: true
		},
		modelId: {
			type: String,
            required: true,
            trim: true,
            unique: true
		},
		hsn_sac: {
			type: String,
            required: true,
            trim: true
		},
		sku: {
			type: String,
            required: true,
            trim: true
		},
		tariffs: [
			{
				type: Schema.Types.ObjectId,
                ref: "Tariff",
                bind: true
			}
		],
		description: {
			type: String,
            required: true,
            trim: true
		},
		images: [
			{
				type: Schema.Types.ObjectId,
				ref: "image"
			}
		],
		category: {
			type: [String],
			default: []
		},
		quantity: {
			type: Number,
			default: 0
		},
        status: {
            type: String,
            enum: Object.values(ProductStatus),
            default: ProductStatus.ACTIVE
        }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const product = model<Product>("Product", productSchema);
