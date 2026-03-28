import torch
from pathlib import Path
from .classifier import TinyVGG
from .regressor import TinyVGGRegressor

def load_classifier(weights_path: str, device: str):
    model = TinyVGG()
    try:
        # Load weights only if they are not placeholders (size > 1 byte)
        weights_file = Path(weights_path)
        if weights_file.exists() and weights_file.stat().st_size > 1:
            state_dict = torch.load(weights_path, map_location=device)
            model.load_state_dict(state_dict)
            print(f"Loaded classifier weights from {weights_path}")
        else:
            print(f"Warning: Classifier weights at {weights_path} are placeholders or missing. Using random initialization.")
    except Exception as e:
        print(f"Error loading classifier weights: {e}. Using random initialization.")
    
    model.to(device)
    model.eval()
    return model


def load_regressor(weights_path: str, device: str):
    model = TinyVGGRegressor()
    try:
        # Load weights only if they are not placeholders (size > 1 byte)
        weights_file = Path(weights_path)
        if weights_file.exists() and weights_file.stat().st_size > 1:
            state_dict = torch.load(weights_path, map_location=device)
            model.load_state_dict(state_dict)
            print(f"Loaded regressor weights from {weights_path}")
        else:
            print(f"Warning: Regressor weights at {weights_path} are placeholders or missing. Using random initialization.")
    except Exception as e:
        print(f"Error loading regressor weights: {e}. Using random initialization.")
    
    model.to(device)
    model.eval()
    return model
