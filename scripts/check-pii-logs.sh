#!/usr/bin/env bash
# =============================================================================
# check-pii-logs.sh — detecta console statements con posible PII
# =============================================================================
# Busca console.log/error/debug/warn en código fuente TypeScript/JavaScript
# que referencien campos sensibles de usuarios o estudiantes.
#
# Uso:
#   bash scripts/check-pii-logs.sh          # escanea todo el repo
#   bash scripts/check-pii-logs.sh --diff   # solo archivos modificados vs main
# =============================================================================

set -euo pipefail

DIFF_ONLY="${1:-}"
FOUND=0

# ---------------------------------------------------------------------------
# Campos PII a detectar en console statements
# Incluye variantes en español e inglés (el codebase mezcla ambos)
# ---------------------------------------------------------------------------
PII_FIELDS='email|phone|tel[eé]fono|celular|dni|cuit|cuil|nombre|apellido|name|address|direcci[oó]n|fecha_nacimiento|birth|student|alumno|guardian|tutor|parent|padre|madre|family|familia|password|passwd|secret|token|session|cookie'

# Console patterns que nos interesan
CONSOLE_PATTERN="console\.(log|error|debug|warn|info|dir|table)\b"

# ---------------------------------------------------------------------------
# Rutas a excluir del escaneo
# ---------------------------------------------------------------------------
EXCLUDE_REGEX="(node_modules|\.next|\.git|dist|build|supabase/seed|scripts/check-pii)"

# ---------------------------------------------------------------------------
# Función principal de escaneo sobre un archivo
# ---------------------------------------------------------------------------
scan_file() {
  local file="$1"
  [[ -f "$file" ]] || return 0

  local matches
  matches=$(grep -nP "(?=.*$CONSOLE_PATTERN)(?=.*($PII_FIELDS))" "$file" 2>/dev/null || true)

  if [[ -n "$matches" ]]; then
    echo "❌  $file"
    while IFS= read -r line; do
      echo "    $line"
    done <<< "$matches"
    echo ""
    return 1
  fi
  return 0
}

# ---------------------------------------------------------------------------
# Construir lista de archivos a escanear y correr el scan
# ---------------------------------------------------------------------------
if [[ "$DIFF_ONLY" == "--diff" ]]; then
  BASE="${BASE_BRANCH:-main}"
  echo "Escaneando archivos modificados vs $BASE..."
  while IFS= read -r file; do
    [[ "$file" =~ \.(ts|tsx|js|mjs)$ ]] || continue
    echo "$file" | grep -qE "$EXCLUDE_REGEX" && continue
    scan_file "$file" || FOUND=1
  done < <(git diff --name-only "origin/$BASE...HEAD" 2>/dev/null || true)
else
  echo "Escaneando todos los archivos fuente..."
  COUNT=0
  while IFS= read -r file; do
    echo "$file" | grep -qE "$EXCLUDE_REGEX" && continue
    COUNT=$((COUNT + 1))
    scan_file "$file" || FOUND=1
  done < <(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.mjs" \) | sort)
  echo "Archivos escaneados: $COUNT"
  echo ""
fi

# ---------------------------------------------------------------------------
# Resultado
# ---------------------------------------------------------------------------
if [[ "$FOUND" -eq 1 ]]; then
  echo "────────────────────────────────────────────────────────────────"
  echo "Se encontraron posibles logs con PII."
  echo "Opciones:"
  echo "  1. Eliminar el console statement"
  echo "  2. Reemplazar el valor por un ID anónimo (user.id, student.id)"
  echo "  3. Usar un logger estructurado con redact configurado"
  echo "────────────────────────────────────────────────────────────────"
  exit 1
fi

echo "✓ No se encontraron console statements con campos PII"
