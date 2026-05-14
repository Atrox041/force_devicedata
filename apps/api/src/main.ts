import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loadEnv } from "./shared/env";

async function bootstrap() {
  loadEnv();

  const app = await NestFactory.create(AppModule, {
    cors: false,
  });

  const corsOrigin = process.env.CORS_ORIGIN;
  if (corsOrigin) {
    app.enableCors({
      origin: corsOrigin.split(",").map((origin) => origin.trim()),
      credentials: true,
    });
  } else {
    app.enableCors();
  }

  app.setGlobalPrefix("api");

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, "0.0.0.0");
}

bootstrap();
