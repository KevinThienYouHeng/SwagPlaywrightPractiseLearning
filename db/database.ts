import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface TestUser {
    id: number,
    username: string,
    password: string,
    role: string,
    expected_error: string | null
}

export class DBhelper {

    private db: Database.Database;
    private readonly DB_PATH: string;

    constructor(){
            this.DB_PATH = path.join(__dirname,'..', 'testdata.db');
            this.db = new Database(this.DB_PATH);
            console.log('Database connected successfully!');
    }

    getAllUsers(): TestUser[] {
        return this.db.prepare('SELECT * FROM users').all() as TestUser[];
    }


    close(): void {
        this.db.close();
        console.log('Database closed successfully!');
    }

    deleteDatabase(): void{
        try{
            this.db.close();

            if (fs.existsSync(this.DB_PATH)) {
                    fs.unlinkSync(this.DB_PATH);
                    console.log('🗑️ Database deleted successfully!');
                    console.log(`📁 Deleted from: ${this.DB_PATH}`);
                } else {
                    console.log('⚠️ Database file not found — nothing to delete!');
                    console.log(`📁 Looked at: ${this.DB_PATH}`);
                }
        }catch(error){
            console.log(`Failed delete database ${error}`);
        }
    }


}



