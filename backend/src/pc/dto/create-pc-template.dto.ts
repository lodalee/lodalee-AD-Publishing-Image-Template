import { ColorChip } from "src/common/enums/color-chip.enum";
import { TemplateCategory } from "src/common/enums/pc-category.enum";

export class CreatePcTemplateItemDto {
  readonly imageUrl: string;
  readonly description?: string;
  readonly category: TemplateCategory;
  readonly colorChip: ColorChip[];
}

export class CreatePcTemplateDto {
  readonly title: string;
  readonly creator: string;
  readonly producedDate: Date;
  readonly type: string;
  readonly items?: CreatePcTemplateItemDto[];
}
