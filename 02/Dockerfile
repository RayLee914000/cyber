FROM python:3.12-slim

WORKDIR /challenge
COPY README.md .
COPY dist ./dist

EXPOSE 8080
CMD ["python", "-m", "http.server", "8080", "-d", "dist"]
