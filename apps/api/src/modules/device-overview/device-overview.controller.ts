import { Controller, Get, Query } from "@nestjs/common";
import { DeviceOverviewService } from "./device-overview.service";

@Controller("dashboard/device-overview")
export class DeviceOverviewController {
  constructor(private readonly service: DeviceOverviewService) {}

  @Get("summary")
  summary(@Query() query: Record<string, string | undefined>) {
    return this.service.getSummary(query);
  }

  @Get("distribution")
  distribution(@Query() query: Record<string, string | undefined>) {
    return this.service.getDistribution(query);
  }

  @Get("vendors")
  vendors(@Query() query: Record<string, string | undefined>) {
    return this.service.getVendors(query);
  }

  @Get("table")
  table(@Query() query: Record<string, string | undefined>) {
    return this.service.getTable(query);
  }

  @Get("statuses")
  statuses(@Query() query: Record<string, string | undefined>) {
    return this.service.getStatuses(query);
  }
}
