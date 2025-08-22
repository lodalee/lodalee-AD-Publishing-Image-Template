import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly bucket = process.env.AWS_S3_BUCKET!;
   private readonly prefix = process.env.AWS_S3_PREFIX_PC;
  private readonly s3: S3Client;

 constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      // SSO 로그인은 AWS SDK가 자동으로 AWS_PROFILE=my-sso 사용
    });
  }

  // 테스트 업로드 (간단 텍스트 파일)
  async uploadTest() {
    const key = `${this.prefix}/test-hello.txt`; // "PC/test-hello.txt"

    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: 'Hello S3! NestJS에서 올린 파일이에요 🚀',
      ContentType: 'text/plain',
    });

    await this.s3.send(cmd);

    return {
      message: '업로드 성공!',
      bucket: this.bucket,
      key,
      url: `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  }
}
