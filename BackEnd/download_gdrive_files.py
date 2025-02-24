import os
import requests
import gdown
from bs4 import BeautifulSoup

# Public Google Drive Folder URL
FOLDER_URL = "https://drive.google.com/drive/folders/1IwQPUV73h9baIAxYGEMEd9WHsaFxHwNY"

# Local directory to save downloaded files
DOWNLOAD_DIR = "GoogleDriveDownloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def get_file_ids_from_folder(folder_url):
    """Extracts file IDs and names from a public Google Drive folder."""
    response = requests.get(folder_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    file_ids = []
    for link in soup.find_all('a'):
        href = link.get('href')
        if href and "drive.google.com/file/d/" in href:
            file_id = href.split("/file/d/")[1].split("/")[0]
            file_ids.append(file_id)
    
    return file_ids

# Get file IDs from the folder
file_ids = get_file_ids_from_folder(FOLDER_URL)
file_ids = []

if not file_ids:
    print("No files found or Google has blocked web scraping. Try a different approach.")
else:
    print(f"Found {len(file_ids)} files. Downloading...")

    for file_id in file_ids:
        try:
            file_url = f"https://drive.google.com/uc?id={file_id}"
            gdown.download(file_url, os.path.join(DOWNLOAD_DIR, f"{file_id}.file"), quiet=False)
        except Exception as e:
            print(f"Failed to download file {file_id}: {e}")

print("Download complete!")
