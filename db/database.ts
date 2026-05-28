import Database from 'better-sqlite3';
import path from 'path';

// ✅ Database file location
const DB_PATH = path.join(__dirname, 'testdata.db');

// ✅ Create or connect to database
const db = new Database(DB_PATH);

console.log('✅ Database connected successfully!');
console.log(`📁 Database location: ${DB_PATH}`);

export default db;