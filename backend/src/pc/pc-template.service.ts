import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePcTemplateDto } from "./dto/create-pc-template.dto";
import { PcTemplate, PcTemplateDocument } from "./schema/pc-template.schema";

@Injectable()
export class PcTemplateService {
    constructor(
        @InjectModel(PcTemplate.name) private templateModel: Model<PcTemplateDocument>,
    ) {}

    async create(dto: CreatePcTemplateDto): Promise<PcTemplate[]>{
        const results: PcTemplate[] = [];

        for (const item of dto.items ?? []) {
            const created = new this.templateModel({
                title: dto.title,
                creator: dto.creator,
                producedDate: dto.producedDate,
                type: dto.type,
                ...item
            });
            results.push(await created.save());
        }

        return results;
    }
}
