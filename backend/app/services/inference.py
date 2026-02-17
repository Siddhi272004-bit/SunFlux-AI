
# 🎯 What This File Should Do

# For classification:
# Take preprocessed tensor
# Run model
# Apply sigmoid
# Convert to probability
# Apply threshold
# Return clean dictionary
# For regression (only if flare detected):
# Run regression model
# Return predicted log flux

import torch

def run_classification(model,input_tensor):
  # runs binary classification model, returns probability and binary prediction

  model.eval()

  with torch.no_grad():
    logits=model(input_tensor) #shape:(1,1)
    logits=logits.squeeze(1)   #shape:(1,)
    probs=torch.sigmoid(logits)

    probability=probs.item() #float
    prediction=1 if probability >=0.5 else 0
  return{
    "probability":probability,
    "prediction":prediction
  }


def run_regression(model, input_tensor):
    """
    Runs regression model.
    Returns predicted log flux.
    """

    model.eval()

    with torch.no_grad():
        output = model(input_tensor)          # shape: (1,1)
        output = output.squeeze(1)

        log_flux = output.item()

    return log_flux
