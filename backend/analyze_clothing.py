import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

# .envファイルから環境変数を読み込み
load_dotenv()

# APIキーの設定
api_key = os.getenv("GOOGLE_AI_API_KEY")
# print(f"DEBUG: 読み込まれたAPIキー: {api_key}")

# if not api_key or api_key.startswith("AIzaSyBxZ3fh"):
#     print("警告: 有効な GOOGLE_AI_API_KEY が .env に設定されていない可能性があります。")

genai.configure(api_key=api_key)

def get_clothing_attributes(img: Image.Image):
    """
    洋服の画像から属性（名前、カテゴリ、季節）を取得する
    """
    # モデルの初期化
    model = genai.GenerativeModel("gemini-3.1-flash-lite")

    # プロンプトの構成
    prompt = """
    画像に写っている洋服を分析し、以下の制約に従って必ず単一のJSON形式（配列不可）で出力してください。

    - name: 色や特徴を踏まえた品物の名前（20文字以内）。
      ※複数の洋服が写っている場合は「〇〇コーデ」や「〇〇セット」という名前にしてください。
    - category: 第一カテゴリ（トップス、ボトムス、アウター、ワンピースなど）。
      ※複数の洋服が写っている場合は「コーディネート」としてください。
    - season: 「春」「夏」「秋」「冬」「通年」から選択。複数該当する場合はカンマ区切り（例: 春,秋）。

    出力フォーマット:
    {
      "name": "文字列",
      "category": "文字列",
      "season": "文字列"
    }
    """

    # Gemini APIの呼び出し
    response = model.generate_content(
        [prompt, img],
        generation_config={"response_mime_type": "application/json"}
    )

    return json.loads(response.text)

if __name__ == "__main__":
    # 使用例: 実際の画像パスを指定して実行してください
    # result = get_clothing_attributes("path/to/your/clothing_image.jpg")
    # print(json.dumps(result, indent=2, ensure_ascii=False))
    pass