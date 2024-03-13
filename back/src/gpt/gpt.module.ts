import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [GptController],
  providers: [GptService],
  imports: [ConfigModule],
})
export class GptModule {}
