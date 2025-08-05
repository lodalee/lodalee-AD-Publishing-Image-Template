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

  /*=================
  ====템플릿 조회====
  ==================*/
  async findAll() {
    return this.templateModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$category', // category 필드 기준 그룹핑
          items: { $push: '$$ROOT' }, // 해당 카테고리 데이터 모두 모으기
        },
      },
      { $sort: { _id: 1 } }, // 카테고리명 기준 정렬(선택)
      {
        $project: {
          // 응답 형태 가독성 위해
          _id: 0,
          category: '$_id',
          items: 1,
        },
      },
    ]);
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

  /*==================
  ===템플릿 자동 업로드===
  ==================*/
  async autoImportFromFolder(rootDir: string) {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const categories = fs
      .readdirSync(rootDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const category of categories) {
      const categoryDir = path.join(rootDir, category);
      const files = fs.readdirSync(categoryDir);

      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) continue;

        const filename = `${Date.now()}-${file}`;
        const sourcePath = path.join(categoryDir, file);
        const destPath = path.join(uploadDir, filename);

        fs.copyFileSync(sourcePath, destPath);

        const imageUrl = `/uploads/${filename}`;

        const created = new this.templateModel({
          title: '디자인북 업로드',
          content: '',
          category: category,
          imageUrl,
          tags: '자체제작',
        });

        await created.save();
      }
    }
    return { message: '자동 업로드 완료' };
  }
}

// findOne(id: number) {
//   return `This action returns a #${id} template`;
// }

// update(id: number, updateTemplateDto: UpdateTemplateDto) {
//   return `This action updates a #${id} template`;
// }

// remove(id: number) {
//   return `This action removes a #${id} template`;
// }
