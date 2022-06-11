import { log } from "../../utils/logger";
import { v4 as uuid } from "uuid";
import { FError } from "../../utils/error";
import { Request, Response } from "express";
import { httpStatusCode } from "../../utils/httpStatusCode";
import { compressedFile } from "../../middleware/sharp";
import { removeLocalFile } from "../../utils/fs";
import { app } from "../..";

export const downloadImageController = async (
	req: Request & {
		compressedFiles?: compressedFile[];
	},
	res: Response
) => {
	const traceId = uuid();
	log.info(`[${traceId}] [downloadImageController] [START]`);
	const files = req.compressedFiles as compressedFile[];
    try {

		await app.locals.bucket
			.file(
				`${"test"}/${"1650186711259_dario-mendez-pvo1dnoj8tA-unsplash.webp"}`
			)
			.createReadStream() //stream is created
			.pipe(res) //pipe the stream to response
			.on("finish", () => {
				log.info(`[${traceId}] [downloadImageController] [END]`);
				return; // The file download is complete
			});

    } catch (error) {
        Promise.all(
			files.map((file) => {
				removeLocalFile(file.path);
			})
		);
		const errorStatus =
			(error as FError).status || httpStatusCode.INTERNAL_SERVER_ERROR;
		const errorMessage = (error as Error).message || "No error description";
		log.error(
			`[${traceId}] [downloadImageController] [ERROR] [${errorMessage}]`
		);
		return res.status(errorStatus).json({
			error: errorMessage
		});
	}
};
