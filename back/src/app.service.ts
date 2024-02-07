import { Injectable } from '@nestjs/common';


//FIXME: DELETE THIS?
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}