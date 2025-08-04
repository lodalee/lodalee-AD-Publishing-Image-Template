import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/index.html')
  getIndex(@Res() res): void {
    const filePath = join(__dirname, '..', 'public', 'pages', 'index.html');
    res.sendFile(filePath);
  }

  @Get('/register.html')
  getRegister(@Res() res): void {
    const filePath = join(__dirname, '..', 'public', 'pages', 'register.html');
    res.sendFile(filePath);
  }
}
