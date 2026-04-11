# ----------------------
# ベースイメージ
# ----------------------
FROM python:3.12-slim

# 作業ディレクトリ
WORKDIR /code

# 必要パッケージインストール
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 依存関係コピーとインストール
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# アプリコピー
COPY . .


#CMD ["sh", "-c", "python manage.py migrate && gunicorn project_name.wsgi:application --bind 0.0.0.0:$PORT"]