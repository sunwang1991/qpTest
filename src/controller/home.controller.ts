import { Controller, Get, Redirect } from '@midwayjs/core';

@Controller('/')
export class HomeController {
  @Get('/')
  @Redirect('/public/dist/index.html')
  async() {}
}
