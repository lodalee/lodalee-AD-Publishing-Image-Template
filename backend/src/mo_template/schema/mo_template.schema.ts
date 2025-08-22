import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

/** =========================
 *  Enums
 *  =======================*/
export enum TemplateCategory {
  INTRO = '인트로',
  MAIN_PAGE = '메인 페이지',
  VIDEO = '동영상',
  FULL_VIDEO = '풀영상',
  PLANNING = '기획',
  POPUP = '팝업',
  SCROLL = '스크롤',
  SECTION_TRANSITION = '섹션 전환 표지',
  SLIDE_SINGLE = '슬라이드섹션-1개',
  SLIDE_OVERLAP = '슬라이드섹션-걸치기',
  SLIDE_CARD = '슬라이드섹션-카드형',
  UNIT = '유니트',
  UNIT_EMPHASIS = '유니트-강조',
  UNIT_CARD = '유니트-카드형',
  CARD_SECTION = '카드섹션',
  CARD_SECTION_WAEGARI = '카드섹션-왜가리',
  CARD_SECTION_IMAGE = '카드섹션-이미지 카드',
  CARD_SECTION_TEXT = '텍스트 카드 섹션',
  LOCATION = '현장&모델하우스 위치',
  CUSTOMER_REGISTER = '관심 고객 등록',
  FOOTER = '푸터',
}

export enum ColorChip {
  RED = 'RED',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  INDIGO = 'INDIGO',
  VIOLET = 'VIOLET',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  GRAY = 'GRAY',
}

const options: SchemaOptions = {
  timestamps: true,
};

/** =========================
 *  Subdocument: Item
 *  =======================*/
@Schema({ _id: false })
export class TemplateItem {
  @Prop({})
  imageUrl: string;

  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ maxlength: 5000 })
  description?: string;

  @Prop({
    required: true,
    enum: Object.values(TemplateCategory),
  })
  category: TemplateCategory;

  @Prop({
    required: true,
    enum: Object.values(ColorChip),
  })
  colorChip: ColorChip;
}
export const TemplateItemSchema = SchemaFactory.createForClass(TemplateItem);

/** =========================
 *  Root: Template
 *  =======================*/
@Schema(options)
export class Mo_Template extends Document {

  @Prop({ required: true, trim: true })
  creator: string;

  @Prop({ type: Date, required: true })
  producedDate: Date;

  @Prop({ type: [TemplateItemSchema], default: [] })
  items: TemplateItem[];

  @Prop({ type: Date, index: true })
  uploadedAt: Date;
}

export const TemplateSchema = SchemaFactory.createForClass(Mo_Template);
export type TemplateDocument = HydratedDocument<Mo_Template>;
