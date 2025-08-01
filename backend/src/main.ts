import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //서버 모드에 따라 port번호 변경
  const mode = process.env.MODE;
  const port =
    mode === 'prod'
      ? Number(process.env.PROD_PORT)
      : Number(process.env.DEV_PORT);

  //모든 네트워크 인터페이스(모든 IP주소)에서 접속 가능
  await app.listen(port, '0.0.0.0');
  console.log(`서버가 ${port} 포트에서 실행 중입니다. 현재 mode => (${mode})`);
}
bootstrap();
