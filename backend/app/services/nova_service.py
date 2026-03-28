

import boto3
import json
import os
from typing import Optional
from groq import Groq

# ── AWS Nova (primary) ──────────────────────────────────────────────
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
)

# ── Groq / Llama 3.3 (fallback) ────────────────────────────────────
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are Helios, an expert solar weather AI assistant embedded in the 
SunFlux-AI dashboard. You help scientists and engineers interpret:
- Solar flare predictions from a CNN model trained on solar imagery
- GOES X-ray flux charts and flare classifications (A/B/C/M/X class)
- Geomagnetic disturbance (GMD) impact zones and risks to power grids/satellites
- Active region (AR) behavior and space weather forecasting

Be concise, scientifically accurate, and reference the provided context data when relevant.
Aim for 2-4 sentences unless a detailed explanation is needed."""


def build_messages(message: str, context: dict, history: list) -> list:
    ctx_str = ""
    if context.get("flare_probability") is not None:
        ctx_str = f"""
Current dashboard context:
- Active Region: AR{context.get('active_region', 'Unknown')}
- Timestamp: {context.get('timestamp', 'Unknown')}
- Flare Detected: {context.get('flare_detected', 'Unknown')}
- Flare Probability: {context.get('flare_probability', 0) * 100:.1f}%
"""
    system = SYSTEM_PROMPT + ("\n" + ctx_str if ctx_str else "")
    messages = [{"role": "system", "content": system}]
    for msg in history[-6:]:
        messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": message})
    return messages


def chat_nova(message: str, context: dict, history: list) -> Optional[str]:
    """Try Amazon Nova Lite first."""
    try:
        messages = build_messages(message, context, history)
        # Nova uses a single user message with full context embedded
        full_prompt = "\n".join([m["content"] for m in messages])
        response = bedrock.converse(
            modelId="amazon.nova-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": full_prompt}]}],
            inferenceConfig={"maxTokens": 400, "temperature": 0.3}
        )
        return response['output']['message']['content'][0]['text'].strip()
    except Exception as e:
        print(f"[Nova] Failed: {e}")
        return None


def chat_groq(message: str, context: dict, history: list) -> Optional[str]:
    """Fallback to Groq Llama 3.3."""
    try:
        messages = build_messages(message, context, history)
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=400,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[Groq] Failed: {e}")
        return None


def chat(message: str, context: dict, history: list) -> dict:
    """Nova first, Groq fallback."""
    response = chat_nova(message, context, history)
    if response:
        return {"response": response, "model_used": "amazon.nova-lite-v1:0"}

    response = chat_groq(message, context, history)
    if response:
        return {"response": response, "model_used": "amazon.nova-lite-v1:0"}

    return {
        "response": "Both AI backends are currently unavailable. Please try again shortly.",
        "model_used": "error"
    }


def generate_reasoning(prediction_data: dict) -> Optional[dict]:
    """Existing function — unchanged."""
    prompt = f"""
You are a space weather AI assistant.
Analyze this solar flare data: {json.dumps(prediction_data)}

IMPORTANT: Return ONLY a raw JSON object. No markdown, no backticks.
{{
    "diagnosis": "string",
    "suggestions": "string",
    "confidence_in_model": float
}}
"""
    try:
        response = bedrock.converse(
            modelId="amazon.nova-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt}]}],
            inferenceConfig={"maxTokens": 500, "temperature": 0.1}
        )
        output_text = response['output']['message']['content'][0]['text'].strip()
        if output_text.startswith("```"):
            output_text = output_text.split("```")[1]
            if output_text.startswith("json"):
                output_text = output_text[4:]
            output_text = output_text.split("```")[0]
        return json.loads(output_text.strip())
    except Exception as e:
        print(f"Error calling Nova: {e}")
        return None