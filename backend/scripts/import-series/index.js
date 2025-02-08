// scripts/import-series/index.js
require('dotenv').config({ path: '../../.env' });
const path = require('path');
const { importSeries } = require('./series-import');

const INPUT_FILE = path.join(__dirname, 'data', 'series.json');
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
    process.exit(1);
}

importSeries(INPUT_FILE, TMDB_API_KEY)
    .then(() => {
        process.exit(0);
    })
    .catch(error => {
        console.error('Erreur lors de l\'import:', error);
        process.exit(1);
    });