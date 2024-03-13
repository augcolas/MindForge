import { Controller, Get } from "@nestjs/common";
import OpenAI from "openai";
import { AppService } from "../app.service";
import { GptService } from "./gpt.service";
import { Threads } from "openai/resources/beta";
import ThreadMessagesPage = Threads.ThreadMessagesPage;

@Controller('gpt')
export class GptController {

  constructor(private readonly gptService: GptService) {}


  @Get("/test")
  async createRoom(): Promise<ThreadMessagesPage> {
    return await this.gptService.getGpt3Response("say hello in ten languages","");
  }

}
