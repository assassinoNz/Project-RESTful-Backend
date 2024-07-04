import { ZodError } from "zod";
import { AxiosError } from "axios";
import { Zodios, ZodiosError } from "@zodios/core";
import { schema } from "../zodios/api.js";

export const client = new Zodios("http://localhost:8080/api/v1", schema);

export function handleError(err: unknown) {
    if (err instanceof AxiosError) {
        console.log(err.response?.status, err.response?.data)
    } else if (err instanceof ZodiosError) {
        if (err.cause instanceof ZodError) {
            console.log(err.message, err.cause.errors);
        } else {
            console.log(err.message);
        }
    } else {
        console.log("Unknown error occurred", err);
    }
}