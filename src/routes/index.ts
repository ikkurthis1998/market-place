import { productRouter } from "./product";

export const router = [
	{
		path: "/products",
		router: productRouter
	}
];
