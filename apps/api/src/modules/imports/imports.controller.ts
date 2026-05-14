import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImportsService } from "./imports.service";

@Controller("imports")
export class ImportsController {
  constructor(private readonly service: ImportsService) {}

  @Post("device-overview")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: Number(process.env.UPLOAD_MAX_MB ?? "20") * 1024 * 1024,
      },
    }),
  )
  async importDeviceOverview(@UploadedFile() file?: Express.Multer.File) {
    return this.service.importDeviceOverview(file);
  }
}

