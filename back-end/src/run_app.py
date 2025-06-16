import uvicorn, os, sys
from dotenv import load_dotenv

def run():
    load_dotenv()
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    host_ip = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("src.app:app", host=host_ip, port=port, reload=True)
