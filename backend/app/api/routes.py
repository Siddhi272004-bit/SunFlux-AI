# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# import torch

# from app.services.data_fetch import list_available_observations, get_triplet, get_attention_regions
# from app.services.preprocessing import preprocess_channels
# from app.services.inference import run_classification, run_regression
# from app.models.load_model import load_classifier, load_regressor
# from app.models.regressor import TinyVGGRegressor

# router = APIRouter()

# # Load models once
# DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
# classifier = load_classifier("weights/classifier.pth", DEVICE)
# regressor = load_regressor("weights/regressor.pth", DEVICE)


# # flare class mapping helper
# def classify_flare_log(log_flux):
#     if log_flux < -7: return "A"
#     elif log_flux < -6: return "B"
#     elif log_flux < -5: return "C"
#     elif log_flux < -4: return "M"
#     else: return "X"


# # -------------------------
# # Request Schema
# # -------------------------
# class AnalyzeRequest(BaseModel):
#     ar: str
#     timestamp: str


# # -------------------------
# # Observations Endpoint
# # -------------------------
# @router.get("/observations")
# async def get_observations():
#     """
#     Returns available AR + timestamp combinations from dataset
#     """
#     try:
#         return list_available_observations()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # -------------------------
# # Analyze Endpoint
# # -------------------------
# @router.post("/analyze")
# async def analyze_observation(request: AnalyzeRequest):
#     """
#     Fetch observation → preprocess → classify
#     """
#     try:
#         # 1. Fetch images
#         img171, img193, img211 = get_triplet(request.ar, request.timestamp)

#         # 2. Preprocess
#         tensor = preprocess_channels(img171, img193, img211, DEVICE)

#         # 3. Run inference
#         classification_result = run_classification(classifier, tensor)
#         # since regression predicts log10 flux
#         log_flux = run_regression(regressor, tensor)
#         peak_flux = 10 ** log_flux  # Convert to physical flux
        
#         flare_class = classify_flare_log(log_flux)

#         # 4. Generate visual attention regions (for UI heatmap)
#         attention_regions = get_attention_regions(img171, img193, img211)

#         return {
#             "active_region": request.ar,
#             "timestamp": request.timestamp,
#             "flare_probability": classification_result["probability"],
#             "flare_detected": bool(classification_result["prediction"]),
#             "log_flux": log_flux,
#             "peak_flux": peak_flux,
#             "flare_class": flare_class,
#             "attention_regions": attention_regions
#         }

#     except ValueError as ve:
#         raise HTTPException(status_code=400, detail=str(ve))

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import torch

from app.services.data_fetch import list_available_observations, get_triplet, get_attention_regions
from app.services.preprocessing import preprocess_channels
from app.services.inference import run_classification, run_regression
from app.models.load_model import load_classifier, load_regressor
from app.models.regressor import TinyVGGRegressor
from app.services.nova_service import chat  # ← NEW

router = APIRouter()

# Load models once
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
classifier = load_classifier("weights/classifier.pth", DEVICE)
regressor = load_regressor("weights/regressor.pth", DEVICE)


# flare class mapping helper
def classify_flare_log(log_flux):
    if log_flux < -7: return "A"
    elif log_flux < -6: return "B"
    elif log_flux < -5: return "C"
    elif log_flux < -4: return "M"
    else: return "X"


# -------------------------
# Request Schemas
# -------------------------
class AnalyzeRequest(BaseModel):
    ar: str
    timestamp: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    context: dict
    history: List[ChatMessage] = []


# -------------------------
# Observations Endpoint
# -------------------------
@router.get("/observations")
async def get_observations():
    try:
        return list_available_observations()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# Analyze Endpoint
# -------------------------
@router.post("/analyze")
async def analyze_observation(request: AnalyzeRequest):
    try:
        img171, img193, img211 = get_triplet(request.ar, request.timestamp)
        tensor = preprocess_channels(img171, img193, img211, DEVICE)
        classification_result = run_classification(classifier, tensor)
        log_flux = run_regression(regressor, tensor)
        peak_flux = 10 ** log_flux
        flare_class = classify_flare_log(log_flux)
        attention_regions = get_attention_regions(img171, img193, img211)

        return {
            "active_region": request.ar,
            "timestamp": request.timestamp,
            "flare_probability": classification_result["probability"],
            "flare_detected": bool(classification_result["prediction"]),
            "log_flux": log_flux,
            "peak_flux": peak_flux,
            "flare_class": flare_class,
            "attention_regions": attention_regions
        }

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# Chat Endpoint
# -------------------------
@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        history = [{"role": m.role, "content": m.content} for m in request.history]
        result = chat(
            message=request.message,
            context=request.context,
            history=history
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))