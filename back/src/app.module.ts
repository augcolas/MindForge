import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import configuration from '../config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SocketModule,
    GptModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
