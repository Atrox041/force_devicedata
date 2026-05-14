import { Controller, Get, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { ExportsService } from "./exports.service";

@Controller("exports")
export class ExportsController {
  constructor(private readonly service: ExportsService) {}

  @Get("device-overview.xlsx")
  async exportDeviceOverview(
    @Query() query: Record<string, string | undefined>,
    @Res() res: Response,
  ) {
    const { fileName, buffer } = await this.service.exportDeviceOverview(query);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.send(buffer);
  }
}

