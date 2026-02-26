## SunFlux-AI ☀️🔥


SunFlux-AI is a PyTorch-based deep learning project for predicting solar flare activity from solar imagery. Motivated by the role of solar flares in triggering geomagnetic disturbances (GMDs) affecting power grids and satellites, the project focuses on OpenCV-based preprocessing, model training, and evaluation, with scope for future scaling.

## Motivation 🎯

Solar flares are a major driver of geomagnetic disturbances (GMDs), which can disrupt power grids,
satellite operations, GPS systems, and radio communications. Recent large-scale power outages
linked to heightened solar activity highlight the need for early warning signals derived from
solar observations.

SunFlux-AI is motivated by this problem: building a reliable solar flare prediction pipeline
that can serve as a foundational signal for downstream space weather and GMD risk assessment systems.

## Current Scope 🎯

The current stage of SunFlux-AI focuses on:
- Preprocessing solar imagery data
- Training deep learning models to predict solar flare activity
- Evaluating model behavior and identifying limitations in generalization

While full geomagnetic disturbance modeling is outside the current scope, this project
establishes the predictive core required for future integration with space weather systems.

## Pipeline Overview 🎯

**1. Data Preprocessing**
   - Min-Max normalization of solar image data
   - Image preprocessing using OpenCV (grayscaling, resizing)
   - Dataset preparation for model training and evaluation

**2. Model Training**
   - PyTorch-based deep learning model
   - Supervised learning setup for solar flare prediction
   - Initial training on limited validation data

**3. Evaluation**
   - Preliminary accuracy observed during training
   - Identified need for larger and more representative validation datasets

## Technical Pipeline 🎯

### 1. Data Preprocessing
Raw solar imagery is preprocessed to improve feature visibility and ensure
consistent model inputs. The preprocessing pipeline includes:

- Grayscale conversion to reduce channel noise and focus on structural intensity patterns
- Min–Max normalization to scale pixel values into a stable numerical range
- Contrast Limited Adaptive Histogram Equalization (CLAHE) to enhance localized
  contrast and highlight flare-related structures across varying illumination levels
- Image resizing and formatting for deep learning compatibility

These steps are designed to improve signal clarity while preserving physically
meaningful solar features.


###2. Model Training
   - PyTorch-based deep learning model
   - Supervised learning setup for solar flare prediction
   - Initial training on limited validation data

###3. Evaluation
   - Preliminary accuracy observed during training
   - Identified need for larger and more representative validation datasets


## Data Preprocessing Examples 🎯

Below are examples of raw solar images and their corresponding preprocessed versions after normalization and grayscale conversion.

## Data Preprocessing 🎯

Solar images are preprocessed to improve feature visibility and ensure consistent
inputs for model training. The preprocessing pipeline includes grayscale conversion,
image resizing, normalization, and CLAHE-based contrast enhancement.

### Resized & Grayscale Images
![Resized Images](app/assets/RESIZED_IMAGES.png)

### CLAHE-Enhanced Images
![CLAHE Preprocessed Images](app/assets/CLAHE_PREPROCESSED_IMAGE.png)

## Model Prediction Example

The following image shows an example inference result produced by the trained
model, including the predicted class and associated probability.

![Prediction Output](app/assets/PREDICTED_IMAGE.png)

## Training Results 🎯

The model was trained for 10 epochs using a supervised learning setup.
Training and validation metrics show stable convergence and consistent
generalization behavior on the available validation split.

- Training accuracy increased from ~78% to ~99%
- Validation accuracy improved steadily, reaching ~99% by epoch 9
- Training and validation losses decreased smoothly with no abrupt divergence

These results indicate effective learning on the current dataset while
highlighting the need for evaluation on larger and more diverse validation
splits to assess robustness.


## Future Work 🎯

- Expand validation on larger and more diverse datasets
- Improve generalization and robustness of predictions
- Explore temporal modeling of solar activity
- Integrate predictions with geomagnetic disturbance (GMD) risk indicators
- Investigate simulation-driven evaluation for rare extreme solar events
-Implement the whole project as full-stack web application
