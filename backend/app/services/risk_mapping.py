import math

def log_flux_to_flux(log_flux:float)->float:
  # converts log10 flux prdiction to actual fluz

  return 10 ** log_flux

def classify_flare(flux:float)->str:
  # classifies flare based on peak flux(W/m^2)
  if flux <1e-7:
    return "A"
  elif flux< 1e-6:
    return "B"
  elif flux<1e-5:
    return "C"
  elif flux < 1e-4:
    return "M"
  else:
    return "X"

def compute_impact_score(flux:float)->float:
  # converts flux into normalized impact score(0-1)
  # used for frontend visualization intensity

  # clamp between C and X range
  min_flux=1e-6
  max_flux=1e-3

  flux=max(min_flux,min(flux,max_flux))

  # log scale normalization
  score=(math.log10(flux)-math.log10(min_flux)) /(
    math.log10(max_flux)-math.log10(min_flux)
  )
  return round(score,3)

def build_risk_response(log_flux:float):
  # full risk interpretation pipeline

  flux=log_flux_to_flux(log_flux)
  flare_class=classify_flare(flux)
  impact_score=compute_impact_score(flux)

  return{
    "log_flux":round(log_flux,4),
    "peak_flux":flux,
    "flare_class":flare_class,
    "impact_score":impact_score
  }
  
