const mongoose = require("mongoose");
const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { User, userSchemaJson } = require("./schema/user");
const { QueryCache } = require("./schema/queryCache");

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.8,
});

const promptTemplate = new PromptTemplate({
  template: `Converta a seguinte pergunta em uma consulta MongoDB válida para a coleção User considerando o seguinte esquema, os campos createdAt e updatedAt não usar funcoes de data:
    {${JSON.stringify(userSchemaJson)}}

    Exemplo de resposta válida:
    {{ "campo": "valor" }}
    {{ "campo": {{ "$regex": "valor", "$options": "i" }} }}
    {{ "createdAt": {{"$gte": new Date("2025-03-10T00:00:00Z"), "$lt": new Date("2025-03-12T00:00:00Z")}} }}


    Agora responda a seguinte pergunta, deixando apenas a query em formato JSON e sem quebra de linha: {question}`,
  inputVariables: ["question"],
});


async function naturalToMongoQuery(question) {
  const cachedQuery = await QueryCache.findOne({ question });
  if (cachedQuery) return cachedQuery.query;

  const prompt = await promptTemplate.format({ question });
  const { content: query } = await llm.invoke(prompt);

  try {
    const queryParse = JSON.parse(query)
    await QueryCache.create({ question, query: queryParse });
    return queryParse;
  } catch (error) {
    console.error("Erro ao processar resposta da IA:", error.message);
    return null;
  }
}

async function findUsers(question) {
  const query = await naturalToMongoQuery(question);
  if (!query) return [];
  return User.find(query).lean();
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const question = "Buscar documentos criados entre ontem e hoje";
    const users = await findUsers(question);
    console.log(users);
    mongoose.disconnect();
  } catch (error) {
    console.log(error);
    mongoose.disconnect();
  }
})();