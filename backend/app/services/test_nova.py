from analysis_service import get_complete_analysis
import json

def run_test():
    print("🚀 Initializing Solar Flare Analysis Test...")
    
    # Simulate some data from your prediction model
    prob = 0.85
    detected = True
    flux = "X2.5"
    
    print(f"📊 Input Data: Probability={prob}, Detected={detected}, Flux={flux}")
    
    # Run the full service
    result = get_complete_analysis(prob, detected, flux)
    
    # Check the result
    if result["nova_reasoning"]:
        print("\n✅ ANALYSIS COMPLETE:")
        print(json.dumps(result, indent=2))
    else:
        print("\n❌ ANALYSIS FAILED: Nova did not return reasoning. Check your keys/session token.")

if __name__ == "__main__":
    run_test()