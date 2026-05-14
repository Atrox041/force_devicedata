import { Module } from "@nestjs/common";
import { DatabaseModule } from "./modules/database/database.module";
import { DeviceOverviewModule } from "./modules/device-overview/device-overview.module";
import { ImportsModule } from "./modules/imports/imports.module";
import { ExportsModule } from "./modules/exports/exports.module";

@Module({
  imports: [DatabaseModule, DeviceOverviewModule, ImportsModule, ExportsModule],
})
export class AppModule {}

