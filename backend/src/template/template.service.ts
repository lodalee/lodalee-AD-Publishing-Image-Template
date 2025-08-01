import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import path from 'path';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Template, TemplateDocument } from './schema/template.schema';
import { Model } from 'mongoose';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
  ) {}

  /*=================
  ====템플릿 등록====
  ==================*/
  async create(
    file: Express.Multer.File,
    createTemplateDto: CreateTemplateDto,
  ) {
    //1.파일명 생성
    const filename = await this.makeFilename(file.originalname);

    // 2. 로컬 uploads 폴더에 저장 (없으면 생성)
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // DB 저장
    const created = new this.templateModel({
      ...createTemplateDto,
      imageUrl: `/uploads/${filename}`,
    });

    const saved = await created.save();
    return saved;
  }

  findAll() {
    return `This action returns all template`;
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }

  /*==================
  ===유틸리티 함수===
  ==================*/

  // 파일명 생성 함수
  async makeFilename(originalname: string) {
    const ext = path.extname(originalname); //확장자
    const baseName = path.basename(originalname, ext); // 확장자 제외 원래 파일명
    const timestamp = Date.now();
    const rand = Math.floor(10000 + Math.random() * 90000); // 10000~99999
    return `${baseName}_${timestamp}_${rand}${ext}`;
  }
}
