export class CreateTemplateDto {
  readonly title: string;
  readonly content?: string;
  readonly category: string;
  readonly imageUrl: string;
  readonly tags?: string;
}
