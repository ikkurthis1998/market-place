import express, { Request, Response } from 'express';
import * as secrets from './utils/secrets';
import admin, { ServiceAccount } from "firebase-admin";
import { serviceAccount } from './utils/firebase/adminConfig';
import { log } from './utils/logger';
import mongoose from 'mongoose';
import { httpStatusCode } from './utils/httpStatusCode';
import { router } from './routes';

export const app = express();


try {
    log.info(`[Storage] [START] Initializing Firebase Admin SDK`);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
        storageBucket: "gs://" + secrets.project_id + ".appspot.com"
    });
    app.locals.bucket = admin.storage().bucket();
    log.info(`[Storage] [END] Firebase Admin SDK Initialized`);
} catch (error) {
    const errorMessage = (error as Error).message || "No error description";
    log.error(`[Storage] [ERROR] [${errorMessage}]`);
    process.exit(1);
}

log.info("[DB] [START] Connecting...");
mongoose
	.connect(secrets.dbUri, {
		dbName: "auth"
	})
	.then(() => {
		log.info("[DB] [END] Connected");
		app.listen(secrets.port, () => {
			log.success(`[Server] Listening on port ${secrets.port}`);
		});
	})
	.catch((error) => {
        log.error(`[DB] [ERROR] ${error.message}`);
        process.exit(1);
	});

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.status(httpStatusCode.OK).json({
		data: "It's alive!"
    });
});

router.map((route) => {
	app.use(route.path, route.router);
});
