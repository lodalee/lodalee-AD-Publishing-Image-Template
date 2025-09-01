import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 정적 파일 직접 라우팅
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  //서버 모드에 따라 port번호 변경
  const mode = process.env.MODE;
  const port =
    mode === 'prod'
      ? Number(process.env.PROD_PORT)
      : Number(process.env.DEV_PORT);

  //모든 네트워크 인터페이스(모든 IP주소)에서 접속 가능
  await app.listen(port, '0.0.0.0');
  app.enableCors({
    origin: true,
    // Credentials: true,
  });
  console.log(`서버가 ${port} 포트에서 실행 중입니다. 현재 mode => (${mode}) 주소 : http://localhost:${port}`);
}
bootstrap();
