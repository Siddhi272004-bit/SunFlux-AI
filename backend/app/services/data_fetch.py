from pathlib import Path
import cv2
import numpy as np

DATASET_ROOT = Path(__file__).parents[2] / "dataset" / "SDOBenchmark-data-example" / "test"


def parse_timestamp(ts_folder: str):
    parts = ts_folder.split("_")
    if len(parts) < 6:
        raise ValueError(f"Invalid timestamp folder: {ts_folder}")
    return f"{parts[0]}-{parts[1]}-{parts[2]}T{parts[3]}:{parts[4]}:{parts[5]}"


def get_triplet(ar: str, timestamp: str):
    ar_folder = DATASET_ROOT / ar

    if not ar_folder.exists():
        raise ValueError("Active region not found")

    # find matching timestamp folder
    for ts_folder in ar_folder.iterdir():
        if not ts_folder.is_dir():
            continue

        ts_parsed = parse_timestamp(ts_folder.name)

        if ts_parsed == timestamp:
            imgs = {}

            for file in ts_folder.iterdir():
                name = file.name

                if "__171" in name:
                    imgs["171"] = cv2.imread(str(file), cv2.IMREAD_GRAYSCALE)
                elif "__193" in name:
                    imgs["193"] = cv2.imread(str(file), cv2.IMREAD_GRAYSCALE)
                elif "__211" in name:
                    imgs["211"] = cv2.imread(str(file), cv2.IMREAD_GRAYSCALE)

            if len(imgs) != 3:
                raise ValueError("Incomplete channel set")

            return imgs["171"], imgs["193"], imgs["211"]

    raise ValueError("Timestamp not found")


def list_available_observations():
    """
    Scan dataset and return list of available AR + timestamp pairs.
    """
    observations = []

    for ar_folder in DATASET_ROOT.iterdir():
        if not ar_folder.is_dir():
            continue

        ar = ar_folder.name

        for ts_folder in ar_folder.iterdir():
            if not ts_folder.is_dir():
                continue

            ts = parse_timestamp(ts_folder.name)
            observations.append({"ar": ar, "timestamp": ts})

    return observations


def get_attention_regions(img1, img2, img3, n=8):
    """
    Creates synthetic 'attention regions' based on image intensity.
    Finds top N brightest locales in the combined image.
    """
    # Average the three channels
    avg_img = (img1.astype(float) + img2.astype(float) + img3.astype(float)) / 3.0
    
    # Downsample to a grid (e.g., 40x40 to match the 0-40 range in frontend)
    grid_size = 40
    small = cv2.resize(avg_img, (grid_size, grid_size))
    
    # Normalize to 0-1
    max_val = small.max() if small.max() > 0 else 1
    small = small / max_val
    
    # Flatten and get top N indices
    flat = small.flatten()
    top_indices = flat.argsort()[-n:][::-1]
    
    regions = []
    for idx in top_indices:
        y, x = divmod(idx, grid_size)
        intensity = float(flat[idx])
        # Only include if meaningful intensity
        if intensity > 0.1:
            regions.append({
                "x": int(x),
                "y": int(y),
                "intensity": round(intensity, 2)
            })
            
    return regions