import { Controller, Get } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  // @Get('presign-put')
  // async presignPut(
  //   @Query('key') key: string,
  //   @Query('contentType') contentType: string,
  // ) {
  //   return this.s3Service.getPresignedPutUrl(key, contentType);
  // }

  // @Get('presign-get')
  // async presignGet(@Query('key') key: string) {
  //   return this.s3Service.getPresignedGetUrl(key);
  // }

  // @Delete()
  // async delete(@Query('key') key: string) {
  //   return this.s3Service.deleteObject(key);
  // }

    @Get('test-upload')
  async testUpload() {
    return this.s3Service.uploadTest();
  }
}
