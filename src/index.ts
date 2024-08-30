import "reflect-metadata"
import { AppDataSource } from "@database/db";
import app from "./app";
import config from '@config/index';

async function main() {
    await AppDataSource.initialize();
    app.listen(config.server.port);
}

main();