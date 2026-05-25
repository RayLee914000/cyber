FROM node:22-slim

WORKDIR /portal
COPY portal/server.js .
COPY README.md ./content/root.md
COPY 01/README.md ./content/01/README.md
COPY 01/hints ./content/01/hints
COPY 02/README.md ./content/02/README.md
COPY 02/hints ./content/02/hints
COPY 03/README.md ./content/03/README.md
COPY 03/hints ./content/03/hints

EXPOSE 8080
CMD ["node", "server.js"]
