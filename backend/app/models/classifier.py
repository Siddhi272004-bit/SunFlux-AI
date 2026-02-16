
import torch
import torch.nn as nn


class TinyVGG(nn.Module):
    def __init__(
        self,
        input_channels: int = 3,
        hidden_units: int = 32,
        num_classes: int = 1,
        image_size: int = 224
    ):
        super().__init__()

        self.features = nn.Sequential(
            nn.Conv2d(input_channels, hidden_units, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            nn.Conv2d(hidden_units, hidden_units, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
        )

        # After 2 MaxPools: image_size → image_size / 4
        final_size = image_size // 4

        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(hidden_units * final_size * final_size, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = self.classifier(x)
        return x
