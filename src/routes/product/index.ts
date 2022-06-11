import express from "express";
import { controller } from "../../controller";
import { upload } from "../../middleware/multer";
import { convertToWebP } from "../../middleware/sharp";

export const productRouter = express.Router();

productRouter.post(
	"/add/images",
	upload.any(),
	convertToWebP,
	controller.uploadImageController
);

productRouter.get("/download/images", controller.downloadImageController);
