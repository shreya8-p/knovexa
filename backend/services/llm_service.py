import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(
    api_key=GROQ_API_KEY
)


def generate_answer(question, context):

    prompt = f"""
You are Knovexa, an AI assistant for answering questions about uploaded company documents.

IMPORTANT RULES:
1. Answer ONLY using the provided context.
2. Do not use outside knowledge.
3. If the answer is not present in the context, say:
"The information is not available in the uploaded documents."
4. Keep the answer concise and direct.
5. Do not mention that you are an AI model.
6. Do not invent names, numbers, dates, or facts.

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": "You answer questions strictly from provided document context."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,
        max_tokens=300,
    )

    return response.choices[0].message.content.strip()