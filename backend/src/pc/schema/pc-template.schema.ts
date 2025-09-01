import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ColorChip } from 'src/common/enums/color-chip.enum';
import { TemplateCategory } from 'src/common/enums/pc-category.enum';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class PcTemplate extends Document {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ required: true, trim: true })
  creator: string;

  @Prop({ type: Date, required: true })
  producedDate: Date;

  @Prop({ required: true })
  type: string;

  @Prop()
  imageUrl: string;

  @Prop({ maxlength: 5000 })
  description?: string;

  @Prop({ required: true, enum: Object.values(TemplateCategory) })
  category: TemplateCategory;

  @Prop({ type: [String], enum: Object.values(ColorChip), default: [] })
  colorChip: ColorChip[];
}

export const PcTemplateSchema = SchemaFactory.createForClass(PcTemplate);
export type PcTemplateDocument = HydratedDocument<PcTemplate>;
