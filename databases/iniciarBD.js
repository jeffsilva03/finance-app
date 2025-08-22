
export async function IniciarBD(database) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS transacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      valor REAL,
      tipo TEXT,
      categoria TEXT,
      data TEXT
    );
  `);
}