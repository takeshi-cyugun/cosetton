import logging
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel
from typing import List, Optional

# ログの設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # .env から自動的に読み込まれます
    supabase_url: str
    supabase_key: str
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

class Item(BaseModel):
    id: int
    name: str
    size: str
    category: str
    season: str
    status: str
    image: str
    owner: str
    description: Optional[str] = None # descriptionはフロントエンドで使われていませんが、バックエンドモデルに残しておきます
    class Config:
        from_attributes = True

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None

class ItemCreate(BaseModel):
    name: str
    size: str
    category: str
    season: str
    status: str
    owner: str
    description: Optional[str] = None

settings = Settings()

# Supabase クライアントの初期化
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 起動時の処理
    logger.info("Application startup: Fetching initial data from Supabase...")
    try:
        fetch_and_log_items()
    except Exception as e:
        logger.error(f"Startup data fetch failed: {e}")
    yield

origins = [
    "http://localhost:8000",  # Next.jsフロントエンドのURLを許可
    # デプロイ環境に応じて、他のオリジンもここに追加してください
]

app = FastAPI(title="Closetton API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://closetton.vercel.app", # 自分のVercelのURL（決まっていない場合は後で修正）
        "*" # テスト用に一時的に全て許可することも可能ですが、公開時は上記のように絞るのが安全です
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fetch_and_log_items() -> List[dict]:
    """itemsテーブルから全件取得してログに出力する"""
    logger.info("Fetching all items from Supabase...")
    try:
        response = supabase.table("items").select("*").order("id", desc=True).execute()
        items = response.data
        logger.info(f"Successfully fetched {len(items)} items.")
        for item in items: # ログ出力も詳細化
            logger.info(f"Item ID: {item.get('id')} - Name: {item.get('name')} - Owner: {item.get('owner')} - Status: {item.get('status')}")
        return items
    except Exception as e:
        logger.error(f"Error fetching items: {e}")
        return []

@app.get("/items", response_model=List[Item])
def get_items():
    """
    Supabaseの同期クライアントを使用しているため、
    FastAPIでは 'def' で定義することで外部スレッドで安全に実行されます。
    """
    items = fetch_and_log_items()
    return items

@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, item_update: ItemUpdate):
    """アイテムの情報を更新する"""
    try:
        # exclude_unset=True により、リクエストに含まれるフィールドのみを更新対象にする
        update_data = item_update.model_dump(exclude_unset=True)
        response = supabase.table("items").update(update_data).eq("id", item_id).execute()
        if len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/items", response_model=Item)
async def create_item(
    file: UploadFile = File(...),
    name: str = Form(...),
    size: str = Form(...),
    category: str = Form(...),
    season: str = Form(...),
    status: str = Form(...),
    owner: str = Form(...),
    description: Optional[str] = Form(None)
):
    """新しいアイテムを登録する"""
    try:
        # 1. 画像ファイルをSupabase Storageにアップロード
        # ファイル名をユニークにするためにタイムスタンプを付与
        file_content = await file.read()
        file_path = f"items/{int(datetime.now().timestamp())}_{file.filename}"

        # バケット名 'closetton' は、あらかじめSupabaseの管理画面で作成しておく必要があります
        # また、Storageのポリシー（Policy）で読み取りと書き込みを許可してください
        supabase.storage.from_("closetton").upload(
            path=file_path,
            file=file_content,
            file_options={"content-type": file.content_type}
        )

        # 2. アップロードした画像の公開URLを取得
        image_url = supabase.storage.from_("closetton").get_public_url(file_path)

        # 3. データベースに登録
        insert_data = {
            "name": name,
            "size": size,
            "category": category,
            "season": season,
            "status": status,
            "owner": owner,
            "description": description,
            "image": image_url
        }

        response = supabase.table("items").insert(insert_data).execute()
        if len(response.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create item")
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating item: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")