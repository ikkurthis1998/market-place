import * as cart from "./cart";
import * as image from "./image";
import * as invoice from "./invoice";
import * as order from "./order";
import * as product from "./product";
import * as user from "./user";

export const db = {
    ...cart,
    ...image,
    ...invoice,
    ...order,
    ...product,
    ...user
};
