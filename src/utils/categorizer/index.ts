import {
    type ChatCompletionRequestMessage,
    ChatCompletionRequestMessageRoleEnum,
    Configuration,
    OpenAIApi,
  } from "openai";
import { CODED_ENTRIES_SYSTEM_MESSAGE_PROMPT_TEMPLATE } from "~/config/system-prompts";
import type { Account } from "~/types/account";
import type { CodedTransaction } from "~/types/coded-transaction";
import { makeAccountGuesses_levenshtein } from "./methods/levenshtein";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function makeCodedEntries(
    transactionDescriptions: string[],
    codedEntries: string[]
) {
    const messages = buildCodedEntriesMessages(
        transactionDescriptions,
        codedEntries
    );
    
    const response = await openai.createChatCompletion({
        // model: "gpt-3.5-turbo",
        model: "gpt-4",
        messages,
        temperature: 0.1
    })

    return response.data.choices[0]?.message?.content;
}

export function buildCodedEntriesMessages(transactionDescriptions: string[],
    codedEntries: string[]) {
  return [
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
}

export function makeAccountGuesses(codedEntry: string, accounts: Account[], method: "gpt-4" | "levenshtein"): CodedTransaction["account_guesses"] {
  return (method === "levenshtein") ? makeAccountGuesses_levenshtein(codedEntry, accounts) : [];
}