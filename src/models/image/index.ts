import { Schema, model } from "mongoose";

export enum ImageStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    DELETED = "DELETED"
}

export type Image = {
	_id: Schema.Types.ObjectId;
	name: string;
	key: string;
    url: string;
    status: string;
	createdAt: Date;
	updatedAt: Date;
};

const imageSchema = new Schema<Image>(
	{
		name: {
			type: String,
            required: true,
            trim: true
		},
		key: {
			type: String,
            required: true,
            trim: true
        },
        url: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: Object.values(ImageStatus),
            default: ImageStatus.ACTIVE
        }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const image = model<Image>("Image", imageSchema);
