"use server"


import OpenAI from 'openai'
import { systemPrompt } from '../helpers/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const evaluateSnippet = async (snippet: string) => {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: snippet }
        ],
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    }

    let attempts = 0

    while (attempts < 5) {
        try {
            const chatCompletion = await openai.chat.completions.create(params)
            if (chatCompletion.choices[0].message.content === null) {
							throw new Error("Received null content from chat completion")
						}
						const evaluation = JSON.parse(chatCompletion.choices[0].message.content)
						return {
							rating: evaluation.rating,
							comment: evaluation.comment, // Assuming 'rating' is a property of the parsed object
						}
        } catch (error) {
            attempts++
            console.error(`Attempt ${attempts}: Failed to get chat completion, retrying...`, error)
            if (attempts === 5) {
                throw new Error("Maximum retry attempts reached, failing with error: " + (error as Error).message)
            }
        }
    }
}