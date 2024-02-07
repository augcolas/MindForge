import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import {DatabaseModule} from "../database/database.module";
@Module({
  providers: [SocketGateway, SocketService],
  imports: [DatabaseModule]
})
export class SocketModule {}
