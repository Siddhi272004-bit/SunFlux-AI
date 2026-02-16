import torch
from .classifier import TinyVGG

def load_classifier(weights_path:str,device:str):
  model=TinyVGG(),
  model.load_state_dict(torch.load(weights_path,map_location=device)),
  model.to(device), #device agnostic
  model.eval()
  return model #now the backend will load the model once at startup
  
