import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  controllers: [S3Controller],
  providers: [
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          region: process.env.AWS_REGION,
          // credentials는 지정하지 않으면 SDK 기본 자격 증명 체인 사용 (SSO, IAM Role 등)
        });
      },
    },
    S3Service,
  ],
  exports: [S3Service], // 다른 모듈에서 S3Service 필요하면 export
})
export class S3Module {}
