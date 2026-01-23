import database from 'infra/database.js';

export default async function health(request, response) {
  const updatedAt = new Date().toISOString();
  const queryVersion = await database.query('SHOW server_version;');
  const queryConnection = await database.query('SHOW max_connections;');
  const databaseName = process.env.POSTGRES_DB;
  const queryActiveConnection = await database.query({
    text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  });

  const dbVersion = queryVersion.rows[0].server_version;
  const dbMaxConnections = queryConnection.rows[0].max_connections;
  const dbOpenedConnections  = queryActiveConnection.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version:  dbVersion,
        max_connections: parseInt(dbMaxConnections),
        opened_connections: parseInt(dbOpenedConnections),
      }
    }
  });
}