import OpenAI from "openai";
require('dotenv').config();

// Now you can access your API key
const apiKey = process.env.API_KEY;

console.log('Your API key is:', apiKey);
const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "developer", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Write a haiku about recursion in programming.",
            },
        ],
        store: true,
    });

    console.log(completion.choices[0].message);