import sharp from "sharp";
import { NextFunction, Request, Response } from "express";
import { removeLocalFile } from "../../utils/fs";
import { httpStatusCode } from "../../utils/httpStatusCode";
import { FError } from "../../utils/error";

export type compressedFile = {
	fieldname: string;
	size: number;
	mimetype: string;
	path: string;
	filename: string;
};

export const convertToWebP = async (
	req: Request & { compressedFiles?: compressedFile[] },
	res: Response,
	next: NextFunction
) => {

    let files = req.files as Express.Multer.File[] ?? [];
	try {
		const invalidFiles = files.filter(
			(file) =>
				["image/jpeg", "image/png", "image/jpg"].indexOf(
					file.mimetype
				) === -1
		);

		// const overSizedFiles = files.filter((file) => file.size > 2000000);

		if (invalidFiles.length > 0) {
			Promise.all(
				files.map((file) => {
					removeLocalFile(file.path);
				})
			);
			return res.status(httpStatusCode.BAD_REQUEST).json({
                error: 'Invalid file type'
			});
		}

		// if (overSizedFiles.length > 0) {
		// 	Promise.all(
		// 		files.map((file) => {
		// 			removeLocalFile(file.path);
		// 		})
		// 	);
		// 	const end = hrtime.bigint();
		// 	await pushLog({
		// 		traceId,
		// 		functionName,
		// 		request: req,
		// 		stage: "End",
		// 		result: {
		// 			error: "File size is over 2MB"
		// 		},
		// 		executionTime: Number(end - start) / 1e6
		// 	});
		// 	return res.status(httpStatusCode.BAD_REQUEST).json({
        //     error: "File size is over 2MB"
		//  });
		// }

		req.compressedFiles = await Promise.all(
			files.map(async (file) => {
				const size = file.size;

				let quality = 90;

				if (size > 1000000) {
					quality = 80;
				}

				if (size > 2000000) {
					quality = 70;
				}

				if (size > 4000000) {
					quality = 60;
				}

				if (size > 8000000) {
					quality = 50;
				}

				let sharpImage = sharp(file.path);

				const metaData = await sharpImage.metadata();

                sharpImage = sharpImage.webp({ quality });
 
                const width = metaData.width as number;
                const height = metaData.height as number;

				if (width > 2000 || height > 2000) {
					const resize =
						width > height
							? { width: 2000 }
							: { height: 2000 };
					sharpImage = sharpImage.resize(resize);
				}

				const details = await sharpImage.toFile(
					file.destination +
						"/" +
						file.filename.split(".")[0] +
						"." +
						"webp"
				);

				const compressedFile = {
					fieldname: file.fieldname,
					size: details.size,
					mimetype: "image/webp",
					path:
						file.destination +
						"/" +
						file.filename.split(".")[0] +
						"." +
						"webp",
					filename: file.filename.split(".")[0] + "." + "webp"
				};

				removeLocalFile(file.path);

				return compressedFile;
			})
		);
		next();
	} catch (error) {
		Promise.all(
			files.map((file) => {
				removeLocalFile(file.path);
			})
        );
        const errorStatus = (error as FError).status || httpStatusCode.INTERNAL_SERVER_ERROR;
        const errorMessage = (error as Error).message || "No error description";
		return res.status(errorStatus).json({
			error: errorMessage
		});
	}
};
