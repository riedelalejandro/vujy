import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const FIXTURE_PATH = path.join(process.cwd(), 'tests', 'fixtures', 'a3-p0', 'seed.json');

export async function loadA3Seed() {
  const fixtureText = await readFile(pathToFileURL(FIXTURE_PATH), 'utf8');
  return JSON.parse(fixtureText);
}
