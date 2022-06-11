import { db } from "../../../../models";
import { Product } from "../../../../models/product/product";
import { Tariff, TariffStatus, TariffType } from "../../../../models/product/tariff";
import { httpStatusCode } from "../../../../utils/httpStatusCode";
import { log } from "../../../../utils/logger";

export type CreateTariffInput = {
    traceId: string;
    currency: string;
    type: TariffType;
    minPrice?: number;
    maxPrice?: number;
    minQuantity?: number;
    maxQuantity?: number;
    inclusive: number;
    exclusive: number;
    gst: number;
    startDate?: Date;
    endDate?: Date;
    product: Product;
    status: TariffStatus;
}

export const createTariff = async ({
    traceId,
    currency = "INR",
    type = TariffType.FIXED,
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
    status = TariffStatus.ACTIVE
}: CreateTariffInput) => {
	log.info(`[${traceId}] [createTariff] [START]`);
	try {

        if (!currency || !type || !inclusive || !exclusive || !gst || !product) {
            log.error(`[${traceId}] [createTariff] [ERROR] [INVALID_INPUT]`);
            return {
                error: {
                    status: httpStatusCode.BAD_REQUEST,
                    message: "Invalid input"
                }
            }
        }

        const tariff = await new db.tariff({
            currency,
            type,
            minPrice,
            maxPrice,
            minQuantity,
            maxQuantity,
            price: {
                inclusive,
                exclusive,
                gst
            },
            startDate,
            endDate,
            product,
            status
        }).save();

        log.info(`[${traceId}] [createTariff] [END]`);
        return { data: tariff };

	} catch (error) {
		const errorMessage = (error as Error).message || "No error description";
		log.error(`[${traceId}] [createTariff] [ERROR] ${errorMessage}`);
		return { error };
	}
};
