import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { ConfigService } from "@nestjs/config";
import { Threads } from "openai/resources/beta";
import ThreadMessagesPage = Threads.ThreadMessagesPage;

@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({apiKey: this.configService.get("openai.key"),});
  }

  private readonly openai: OpenAI;

  async getGpt3Response(prompt: string, conversationHistory: string): Promise<ThreadMessagesPage> {

    const assistant =  await this.openai.beta.assistants.retrieve("asst_8P9XzsUThjxTaEYg1q8MxHm5")

    //const thread = await this.openai.beta.threads.retrieve("thread_ZFIZjZEUtQgqfixIYKCW4rla");
    let thread = await this.openai.beta.threads.create();

    await this.openai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content: "Tout le monde fait tapis, tu as une quinte flush royale. Tu as 2000 jetons, tu fais quoi ?"
      }
    );


    const run = await this.openai.beta.threads.runs.create(
      thread.id,
      {
        assistant_id: assistant.id,
      }
    );

    let runResult = await this.openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    //Run.status: "queued" | "in_progress" | "requires_action" | "cancelling" | "cancelled" | "failed" | "completed" | "expired"
    while (runResult.status != "completed") {
        runResult = await this.openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
        console.log(runResult.status);
    }

    //return the response value from the last message
    const messages = await this.openai.beta.threads.messages.list(
      thread.id
    );

    console.log((messages.data[0].content[0] as any).text.value);

    return messages;
  }

}

