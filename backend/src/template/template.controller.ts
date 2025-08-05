import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTemplateDto: CreateTemplateDto,
  ) {
    return this.templateService.create(file, createTemplateDto);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  @Post('auto-upload')
  async autoUpload(@Body('rootDir') rootDir: string) {
    return this.templateService.autoImportFromFolder(rootDir);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.templateService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTemplateDto: UpdateTemplateDto,
  // ) {
  //   return this.templateService.update(+id, updateTemplateDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.templateService.remove(+id);
  // }
}
