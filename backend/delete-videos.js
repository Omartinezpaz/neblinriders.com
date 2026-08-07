const Database = require('better-sqlite3');
const db = new Database('d:/Neblina_Reider/backend/.tmp/data.db');

try {
  const result = db.prepare('DELETE FROM videos').run();
  console.log('Deleted rows:', result.changes);
} catch (e) {
  console.error(e);
}
db.close();
