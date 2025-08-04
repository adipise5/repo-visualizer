import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GITHUB_API = "https://api.github.com"
RAW_URL = "https://raw.githubusercontent.com"

@app.get("/repo/tree")
def get_repo_tree(owner: str, repo: str, branch: str = "main"):
    url = f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
    headers = {"Accept": "application/vnd.github.v3+json"}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Repository not found")
    tree_data = response.json().get("tree", [])
    files = [item for item in tree_data if item["type"] == "blob"]
    return {"files": files}

@app.get("/repo/file")
def get_file_content(owner: str, repo: str, file_path: str, branch: str = "main"):
    raw_url = f"{RAW_URL}/{owner}/{repo}/{branch}/{file_path}"
    response = requests.get(raw_url)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="File not found")
    return {"content": response.text}

