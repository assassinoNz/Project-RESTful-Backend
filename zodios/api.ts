import { makeApi } from "@zodios/core";
import { z } from "zod";

const ActiveStatus = z.enum(["ACTIVE", "INACTIVE"]);

const User = z
    .object({
        id: z.number().int(),
        mobile: z.string(),
        roleId: z.number().int(),
        status: ActiveStatus,
    })
    ;

const CreateUser = z
    .object({
        data: z.object({
            mobile: z.string().regex(/0\d{9}/, "Mobile numbers must be in format 0xxxxxxxxx"),
            roleId: z.number().int(),
            status: ActiveStatus,
        }),
    })
    ;

export const schema = makeApi([
    {
        method: "get",
        path: "/users",
        requestFormat: "json",
        parameters: [
            {
                name: "page",
                type: "Query",
                schema: z.number().int().optional(),
            },
            {
                name: "pageSize",
                type: "Query",
                schema: z.number().int().lte(100).optional(),
            },
        ],
        response: z.array(User),
    },
    {
        method: "post",
        path: "/users",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateUser,
            },
        ],
        response: User,
    },
    {
        method: "get",
        path: "/users/:id",
        requestFormat: "json",
        parameters: [
            {
                name: "id",
                type: "Path",
                schema: z.number().int(),
            },
        ],
        response: User,
        errors: [
            {
                status: 404,
                description: `The server cannot find the requested resource.`,
                schema: z.object({ code: z.literal(404), message: z.string() }),
            },
        ],
    },
    {
        method: "put",
        path: "/users/:id",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: CreateUser,
            },
            {
                name: "id",
                type: "Path",
                schema: z.number().int(),
            },
        ],
        response: User,
        errors: [
            {
                status: 404,
                description: `The server cannot find the requested resource.`,
                schema: z.object({ code: z.literal(404), message: z.string() }),
            },
        ],
    },
]);
