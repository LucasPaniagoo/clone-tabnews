import database from 'infra/database.js';

export default async function health(request, response) {
  const result = await database.query("SELECT 1 + 1 as sum;")
  console.log(result);
  response.status(200).json({ chave: "valor"});
}