import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { PcTemplateService } from "./pc-template.service";
import { CreatePcTemplateDto } from "./dto/create-pc-template.dto";
import { PcTemplate } from "./schema/pc-template.schema";

@Controller("api/pc/template")
export class PcTemplateController {
  constructor(private readonly pcTemplateService: PcTemplateService) {}

  @Post()
  async create(@Body() createDto: CreatePcTemplateDto): Promise<PcTemplate[]> {
    return this.pcTemplateService.create(createDto);
  }
}
