import { PrismaClient } from "./generated/client";

export const db = globalThis.prisma || new PrismaClient();

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}

/* This code ensures that a single instance of the Prisma Client (db) is used throughout the application, especially 
during development where hot-reloading can cause multiple instances. It first checks if a Prisma Client already exists 
on globalThis; if not, it creates a new one. The declare global block tells TypeScript about the custom prisma property 
on the global object. Finally, it assigns the db instance to globalThis.prisma, but only in development environments 
to avoid potential memory leaks in development. */
