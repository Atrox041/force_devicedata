import { Module } from "@nestjs/common";
import { DeviceOverviewController } from "./device-overview.controller";
import { DeviceOverviewService } from "./device-overview.service";

@Module({
  controllers: [DeviceOverviewController],
  providers: [DeviceOverviewService],
})
export class DeviceOverviewModule {}

