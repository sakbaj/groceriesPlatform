/**
 * Vercel Serverless Function entry point.
 * Re-exports the Express app from backend/server.js
 * so Vercel can handle it as a serverless function.
 */
const app = require('../backend/server');

module.exports = app;
