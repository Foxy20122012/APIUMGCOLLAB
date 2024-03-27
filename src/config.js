import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "srv826.hstgr.io";
export const DB_USER = process.env.DB_USER|| "u930882479_UMGCOLLAB";
export const DB_PORT = process.env.DB_PORT || "3306";
export const DB_PASSWORD = process.env.DB_PASSWORD || "Merlos2012";
export const DB_DATABASE = process.env.DB_DATABASE || "u930882479_UMGCOLLAB";
export const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;