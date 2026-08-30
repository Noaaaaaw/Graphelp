import torch
from PIL import Image
import torchvision.transforms as transforms

# Load model sekali aja pas backend nyala (bukan tiap request)
model = torch.load("model.pt", map_location="cpu", weights_only=False)
model.eval()

# Sesuaikan transform ini dengan yang kamu pakai pas training
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Ganti sesuai label/kelas output model kamu
LABELS = ["Sesuai Usia", "Perlu Perhatian"]

def predict_image(image_file):
    image = Image.open(image_file).convert("RGB")
    tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(tensor)
        pred_idx = output.argmax(dim=1).item()

    return LABELS[pred_idx]