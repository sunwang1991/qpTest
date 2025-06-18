import { Controller, Get, Redirect } from '@midwayjs/core';

@Controller('/')
export class HomeController {
  @Get('/')
  @Redirect('/public/index.html')
  async() {}
}
