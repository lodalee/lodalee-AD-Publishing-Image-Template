import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Template extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  tags: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
export type TemplateDocument = HydratedDocument<Template>;
