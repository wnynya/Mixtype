'use strict';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';

const app = express();

app.disable('x-powered-by');

app.use(express.static(path.resolve(__dirname, './public')));

app.all('/{*all}', (req, res) => {
  res.status(404).end();
});

export default app;
