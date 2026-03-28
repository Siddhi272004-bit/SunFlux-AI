import json
# Import the function we built in the previous step
from nova_service import generate_reasoning 

def get_complete_analysis(flare_prob, flare_detected, peak_flux):
    # 1. Prepare the data structure
    prediction_output = {
        "flare_probability": flare_prob,
        "flare_detected": flare_detected,
        "peak_flux": peak_flux
    }

    # 2. Get the reasoning from Amazon Nova
    # This calls the bedrock.converse() function we wrote earlier
    nova_output = generate_reasoning(prediction_output)

    # 3. Return the combined results
    return {
        "prediction": prediction_output,
        "nova_reasoning": nova_output
    }