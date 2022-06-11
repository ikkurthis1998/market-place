import { log } from "../../utils/logger";
import { v4 as uuid } from "uuid";
import { FError } from "../../utils/error";
import { Request, Response } from "express";
import { httpStatusCode } from "../../utils/httpStatusCode";
import { compressedFile } from "../../middleware/sharp";
import { removeLocalFile } from "../../utils/fs";
import { app } from "../..";

export const uploadImageController = async (
	req: Request & {
		compressedFiles?: compressedFile[];
	},
	res: Response
) => {
	const traceId = uuid();
	log.info(`[${traceId}] [uploadImageController] [START]`);
	const files = req.compressedFiles as compressedFile[];
    try {

        await Promise.all(files.map(async file => {
            const uploadRes = await app.locals.bucket.upload(files[0].path, {
				destination: `${"test"}/${file.filename}`,
				public: true,
				metadata: {
					cacheControl: "public, max-age=31536000",
					contentType: files[0].mimetype
				}
			});
        }));

        log.info(`[${traceId}] [uploadImageController] [END]`);
        return res.status(httpStatusCode.OK).json({
            data: files
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
			`[${traceId}] [uploadImageController] [ERROR] [${errorMessage}]`
		);
		return res.status(errorStatus).json({
			error: errorMessage
		});
	}
};
