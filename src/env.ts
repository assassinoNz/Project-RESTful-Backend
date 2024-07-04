import "dotenv/config";

export const NODE_ENV = process.env["NODE_ENV"]!.toString();
export const MYSQL_URL = process.env["MYSQL_URL"]!.toString();
export const EXPRESS_PORT = parseInt(process.env["EXPRESS_PORT"]!.toString());
export const PAGE_SIZE = parseInt(process.env["PAGE_SIZE"]!.toString());