#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IkFETUlOSVNUUkFUT1IiLCJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc0Mzk1Mjg1MCwiZXhwIjoxNzQzOTU2NDUwfQ.FYojnfn26mtzNjKFS49cSBX6x2mvTsPDOEjccfPU3jQ"  # ou leia de um arquivo: TOKEN=$(<token.txt)
JSON_FILE="disciplinas.json"
URL="http://localhost:8080/protected/disciplines"


if ! command -v jq &> /dev/null; then
  echo "jq não está instalado. Instale com: sudo apt install jq"
  exit 1
fi
jq -c 'reverse | .[]' "$JSON_FILE" | while read -r disciplina; do
  echo "Enviando: $disciplina"
  curl -X POST "$URL" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$disciplina"
  echo -e "\n---"
done

