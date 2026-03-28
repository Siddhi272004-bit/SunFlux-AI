import cv2
import torch

from app.models.load_model import load_classifier
from app.services.preprocessing import preprocess_channels
from app.services.inference import run_classification

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


def load_gray(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Could not load {path}")
    return img


def main():
    # Load sample images
    img_171 = load_gray("./sample/171.jpg")
    img_193 = load_gray("./sample/193.jpg")
    img_211 = load_gray("./sample/211.jpg")

    # Preprocess
    tensor = preprocess_channels(img_171, img_193, img_211, DEVICE)

    # Load model
    classifier = load_classifier("weights/classifier.pth", DEVICE)

    # Run inference
    result = run_classification(classifier, tensor)

    print("\n=== Classification Result ===")
    print(result)


if __name__ == "__main__":
    main()