import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getHello(@Res() response) {
    return response.send('Ordero API V2');
  }
}
