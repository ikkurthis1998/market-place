import { db } from "../../../../models";
import { Tariff, TariffStatus, TariffType } from "../../../../models/product/tariff";
import { httpStatusCode } from "../../../../utils/httpStatusCode";
import { log } from "../../../../utils/logger"
import { createTariff } from "../tariffCRUD/createTariff";

export type CreateProductInput = {
    traceId: string;
    name: string;
    modelId: string;
    hsn_sac: string;
    sku: string;
    tariff: Tariff;
    description: string;
    category: string[];
}

export const createProduct = async ({
	traceId,
	name,
	modelId,
	hsn_sac,
	sku,
	tariff,
	description,
	category
}: CreateProductInput) => {
	log.info(`[${traceId}] [createProduct] [START]`);
	try {
		if (
			!name ||
			!modelId ||
			!hsn_sac ||
			!sku ||
			!tariff ||
			!description ||
			!category
		) {
			log.error(`[${traceId}] [createProduct] [ERROR] [INVALID_INPUT]`);
			return {
				error: {
					status: httpStatusCode.BAD_REQUEST,
					message: "Invalid input"
				}
			};
		}

		const product = await new db.product({
			name,
			modelId,
			hsn_sac,
			sku,
			description,
			category
		}).save();

		const {
			currency,
			type,
			minPrice,
			maxPrice,
			minQuantity,
			maxQuantity,
			price: { inclusive, exclusive, gst },
			startDate,
			endDate,
			status
		} = tariff;

		const { data, error } = await createTariff({
			traceId,
			currency,
			type: (type as TariffType) ?? TariffType.FIXED,
			minPrice,
			maxPrice,
			minQuantity,
			maxQuantity,
			inclusive,
			exclusive,
			gst,
			startDate,
			endDate,
			product,
			status: (status as TariffStatus) ?? TariffStatus.ACTIVE
		});

		if (error) {
			await product.remove();
			const errorMessage =
				(error as Error).message ?? "No error description";
			log.error(`[${traceId}] [createProduct] [ERROR] ${errorMessage}`);
			return { error };
		}

		log.info(`[${traceId}] [createProduct] [END]`);
		return {
			data: {
				...product.toObject(),
				tariff: data
			}
		};
	} catch (error) {
		const errorMessage = (error as Error).message || "No error description";
		log.error(`[${traceId}] [createProduct] [ERROR] ${errorMessage}`);
		return { error };
	}
};