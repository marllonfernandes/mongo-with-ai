const mongoose = require("mongoose");

// Schema para armazenar templates de consulta
const QueryCacheSchema = new mongoose.Schema({
  question: String,
  query: Object,
});

const QueryCache = mongoose.model('QueryCache', QueryCacheSchema);

module.exports = { QueryCache }