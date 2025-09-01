import { MongooseModule } from "@nestjs/mongoose";
import { PcTemplate, PcTemplateSchema } from "./schema/pc-template.schema";
import { PcTemplateController } from "./pc-template.controller";
import { PcTemplateService } from "./pc-template.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PcTemplate.name, schema: PcTemplateSchema },
        ]),
    ],
    controllers: [PcTemplateController],
    providers: [PcTemplateService],
    exports: [PcTemplateService],
})
export class PcTemplateModule {}