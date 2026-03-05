import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docPath = path.resolve(__dirname, '..', 'docs', '10-MCP-SCHEMAS.md');

const text = fs.readFileSync(docPath, 'utf8');
const lines = text.split(/\r?\n/);

function parseSections() {
  const sections = [];
  let current = null;
  let capture = null;
  let buffer = [];

  const flushBlock = () => {
    if (!capture || buffer.length === 0) return;
    const jsonText = buffer.join('\n');
    try {
      const parsed = JSON.parse(jsonText);
      if (capture === 'input') current.inputSchema = parsed;
      else if (capture === 'output') current.outputSchema = parsed;
      else if (capture === 'example') current.examples.push(parsed);
    } catch (err) {
      throw new Error(`JSON parse error in ${current?.name || 'unknown'} (${capture}): ${err.message}`);
    }
    buffer = [];
    capture = null;
  };

  for (const line of lines) {
    const sectionMatch = line.match(/^## \d+\) `(.*?)`/);
    if (sectionMatch) {
      if (current) sections.push(current);
      current = { name: sectionMatch[1], inputSchema: null, outputSchema: null, examples: [] };
      continue;
    }

    if (line.startsWith('### Input')) {
      flushBlock();
      capture = 'input';
      continue;
    }
    if (line.startsWith('### Output')) {
      flushBlock();
      capture = 'output';
      continue;
    }
    if (line.startsWith('#### Example')) {
      flushBlock();
      capture = 'example';
      continue;
    }

    if (line.trim() === '```json') {
      buffer = [];
      continue;
    }
    if (line.trim() === '```') {
      flushBlock();
      continue;
    }
    if (capture) buffer.push(line);
  }
  if (current) sections.push(current);
  return sections;
}

const sections = parseSections();

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

let errors = 0;
for (const section of sections) {
  if (!section.outputSchema) continue; // nothing to validate
  const validate = ajv.compile(section.outputSchema);
  for (const example of section.examples) {
    const valid = validate(example);
    if (!valid) {
      errors++;
      console.error(`❌ ${section.name} example invalid`);
      console.error(validate.errors);
    }
  }
}

if (errors > 0) {
  console.error(`Schema validation failed (${errors} invalid examples).`);
  process.exit(1);
}
console.log('✅ MCP schema examples valid');
