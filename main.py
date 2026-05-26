import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Lexicon API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mohammed-owzzz.github.io", "http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    base_prompt: str

@app.post("/expand")
async def expand_prompt(request: PromptRequest):
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="Server missing API Key")
        
    try:
        system_instructions = """You are 'Lexicon', an elite Prompt Engineering AI. Your task is to take a user's lazy, vague request and expand it into a single, masterclass-level prompt for an LLM.

CRITICAL FORMATTING RULES:
1. You MUST use exactly these four headers in brackets, and you MUST use them EXACTLY ONCE: [ROLE], [OBJECTIVE], [TONE/STYLE], and [CONSTRAINTS]. Do NOT repeat the structure or provide multiple options.
2. Under each header, write the content directly on the next line. DO NOT use colons, semicolons, dashes, bullet points, or any special characters at the beginning of the lines. Just output pure text.
3. NEVER use markdown bolding (**), italics (*), or hashtags (#). Keep the text raw and clean.
4. NO conversational filler. Start immediately with [ROLE] and end after the constraints.

CONTENT AND TONE RULES:
- NO ROBOTIC JARGON: Avoid awkward "AI speak" (e.g., "delve into", "utilize"). Write in clear, natural human English.
- BE INVENTIVE: If the prompt is vague, INVENT a compelling scenario, target audience, and specific details.
- ROLE: Assign a specific, expert persona.
- OBJECTIVE: Make the goal actionable.
- TONE/STYLE: Define the exact voice.
- CONSTRAINTS: Give strict, realistic boundaries."""

        client = Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": f"Expand this base prompt: {request.base_prompt}"}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.5, 
        )
        return {"status": "success", "expanded_prompt": chat_completion.choices[0].message.content.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))