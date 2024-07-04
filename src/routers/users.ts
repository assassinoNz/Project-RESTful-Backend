import * as Env from "../env.js";
import { zodiosRouter } from "@zodios/express";
import { App } from "../app.js";
import { schema } from "../../zodios/api.js";

export const router = zodiosRouter(schema);

router.get("/users", async (req, res, next) => {
    try {
        const items = await App.prisma.user.findMany({
            skip: (req.query.page ?? 0) * (req.query.pageSize ?? Env.PAGE_SIZE),
            take: req.query.pageSize ?? Env.PAGE_SIZE
        });

        return res.status(200).json(items);
    } catch (err) {
        return next(err);
    }
});

router.get("/users/:id", async (req, res, next) => {
    try {
        const item = await App.prisma.user.findUnique({
            where: { id: req.params.id }
        });
        if (!item) {
            return res.status(404).json({
                code: 404,
                message: "Couldn't find user"
            })
        }
        return res.status(200).json(item);
    } catch (err) {
        return next(err);
    }
});

router.post("/users", async (req, res, next) => {
    try {
        const item = await App.prisma.user.create({
            data: {
                ...req.body.data
            }
        });
        return res.status(201).json(item);
    } catch (err) {
        return next(err);
    }
});

router.put("/users/:id", async (req, res, next) => {
    try {
        const item = await App.prisma.user.update({
            where: { id: req.params.id },
            data: req.body.data
        });
        return res.status(200).json(item);
    } catch (err) {
        return next(err);
    }
});