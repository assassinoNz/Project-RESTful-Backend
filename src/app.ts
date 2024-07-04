import * as Env from "./env.js";
import express from "express";
import winston from "winston";
import winstonDailyRotate from "winston-daily-rotate-file";
import cors from "cors";
import { serve, setup } from "swagger-ui-express";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "./class.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { zodiosApp } from "@zodios/express";
import { schema } from "../zodios/api.js";
import { openApiBuilder } from "@zodios/openapi";

export class App {
    static readonly cwd = new URL(".", import.meta.url).pathname;

    //Winston
    static winston = winston.createLogger({
        level: "http",
        format: winston.format.printf(info => {
            const now = new Date().toLocaleTimeString('en-US', { hour12: false });

            return `${now} - ${info.level}: ${info.message} ${JSON.stringify(info)}`;
        }),
        transports: [
            new winstonDailyRotate({
                filename: "logs/%DATE%.log",
                datePattern: "YYYY-MM-DD",
                zippedArchive: true,
                maxSize: "20m",
                maxFiles: "30d"
            })
        ],
    });

    //Prisma
    static readonly prisma = new PrismaClient();

    //Zodios
    static readonly zodios = zodiosApp();

    static async start() {
        //Add a console logger only on development
        if (Env.NODE_ENV === "development") {
            this.winston.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }));
        }

        //Setup global middleware
        this.zodios.use(cors());
        this.zodios.use(express.json({ limit: "500kB" }));

        //Attach routers
        this.zodios.use("/api/v1", (await import("./routers/users.js")).router);

        //Attach API docs route only on development
        if (Env.NODE_ENV === "development") {
            const openapi = openApiBuilder({
                title: "Smart POS System",
                version: "1.0.0"
            }).addPublicApi(schema)
                .build();

            this.zodios.use("/docs/v1", serve);
            this.zodios.use("/docs/v1", setup(openapi));
        }

        //Attach error handler
        this.zodios.use(((err, _req, res) => {
            if (err instanceof ZodError) {
                winston.info("Handled ZodError", err);
                return res.status(400).json({ message: err.errors });
            } else if (err instanceof AppError) {
                winston.info(`Handled ${err.statusCode} error`, err.message);
            } else if (err instanceof PrismaClientKnownRequestError) {
                winston.error("Handled PrismaClientKnownRequestError", err);
                return res.status(500).json({ ...err })
            }

            return res.status(500).json({ message: "Unknown error occurred" });
        }) as express.ErrorRequestHandler);

        //Start listening
        this.zodios.listen(Env.EXPRESS_PORT, () => {
            App.winston.info("Starting", {
                env: Env.NODE_ENV,
                port: Env.EXPRESS_PORT,
                cwd: this.cwd
            });
        });
    }
}

App.start();