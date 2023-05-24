import {
    type ChatCompletionRequestMessage,
    ChatCompletionRequestMessageRoleEnum,
    Configuration,
    OpenAIApi,
  } from "openai";
import { CODED_ENTRIES_SYSTEM_MESSAGE_PROMPT_TEMPLATE } from "~/config/system-prompts";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function makeCodedEntries(
    transactionDescriptions: string[],
    codedEntries: string[]
) {
    const messages = [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: CODED_ENTRIES_SYSTEM_MESSAGE_PROMPT_TEMPLATE.replace(
            "{coded_entries}",
            JSON.stringify(codedEntries)
          )
        },
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: JSON.stringify(transactionDescriptions),
        },
      ] as Array<ChatCompletionRequestMessage>;

    const response = await openai.createChatCompletion({
        // model: "gpt-3.5-turbo",
        model: "gpt-4",
        messages,
        temperature: 0.1
    })

    return response.data.choices[0]?.message?.content;
}