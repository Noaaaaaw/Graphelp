import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import numpy as np

# ==== GANTI ISI DICTIONARY INI DENGAN DATA DESKRIPSI KAMU ====
ENNEAGRAM_INFO = {
    1: {"name": "The Reformer", "description": "..."},
    2: {"name": "The Helper", "description": "..."},
    3: {"name": "The Achiever", "description": "..."},
    4: {"name": "The Individualist", "description": "..."},
    5: {"name": "The Investigator", "description": "..."},
    6: {"name": "The Loyalist", "description": "..."},
    7: {"name": "The Enthusiast", "description": "..."},
    8: {"name": "The Challenger", "description": "..."},
    9: {"name": "The Peacemaker", "description": "..."},
}
# ================================================================

def load_enneagram_model(model_path='best_enneagram_model.pth'):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    if hasattr(models, 'EfficientNet_B0_Weights'):
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    else:
        model = models.efficientnet_b0(pretrained=True)

    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 9)
    )

    checkpoint = torch.load(model_path, map_location=device)
    if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
        model.load_state_dict(checkpoint['model_state_dict'])
    else:
        model.load_state_dict(checkpoint)

    model = model.to(device)
    model.eval()
    return model, device

_model, _device = load_enneagram_model()

infer_transforms = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_image(image_file):
    image = Image.open(image_file).convert('RGB')
    tensor_img = infer_transforms(image).unsqueeze(0).to(_device)

    with torch.no_grad():
        outputs = _model(tensor_img)
        probabilities = torch.softmax(outputs, dim=1)[0].cpu().numpy()

    pred_idx = int(np.argmax(probabilities))
    pred_type = pred_idx + 1
    confidence = float(probabilities[pred_idx] * 100)

    top3_indices = np.argsort(probabilities)[::-1][:3]
    top3 = [
        {
            "type": int(i + 1),
            "name": ENNEAGRAM_INFO[int(i + 1)]["name"],
            "prob": float(probabilities[i] * 100)
        }
        for i in top3_indices
    ]

    info = ENNEAGRAM_INFO[pred_type]
    return {
        "pred_type": pred_type,
        "type_name": info["name"],
        "description": info["description"],
        "confidence": confidence,
        "top3": top3
    }
