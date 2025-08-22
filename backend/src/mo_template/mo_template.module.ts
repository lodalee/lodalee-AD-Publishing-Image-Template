import { Module } from '@nestjs/common';
import { MoTemplateController } from './mo_template.controller';
import { MoTemplateService } from './mo_template.service';


@Module({
  controllers: [MoTemplateController],
  providers: [MoTemplateService]
})
export class MoTemplateModule {}
