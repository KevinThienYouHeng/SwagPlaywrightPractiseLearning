import Database from 'better-sqlite3';
import path from 'path';
import { test, expect } from '@playwright/test';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '..', 'testdata.db');

test('Verify database connection works', async ({}) => {
    const db = new Database(DB_PATH);

    console.log('✅ Database connected successfully!');
    console.log(`📁 Database path: ${db.name}`);

    db.close();
    
})

test('Create test user table', async () => {
    const db = new Database(DB_PATH);

    console.log('✅ Database connected successfully!');

    //IF NOT EXISTS
    //Check table already exists before creating so running it multiple time does not duplicate the table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            expected_error TEXT 
        )
    `);

    const table = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type='table'
        AND name='users'
    `).get();

    console.log(`${JSON.stringify(table)}`);
    
    db.close();
    
})

test('Delete db', async () => {

     if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log('🗑️ Database deleted successfully!');
        console.log(`📁 Deleted from: ${DB_PATH}`);
    } else {
        console.log('⚠️ Database file not found — nothing to delete!');
        console.log(`📁 Looked at: ${DB_PATH}`);
    }
})

test('Insert test users datat into database', async () =>{

    const db = new Database(DB_PATH);

    const insertUser = db.prepare(`
        INSERT INTO users 
        (username, password, role, expected_error)
        VALUES (?, ?, ?, ?)`
    );

    insertUser.run('standard_user',          'secret_sauce', 'standard',    null);
    insertUser.run('problem_user',           'secret_sauce', 'problem',     null);
    insertUser.run('performance_glitch_user', 'secret_sauce', 'performance', null);
    insertUser.run('visual_user',            'secret_sauce', 'visual',      null);
    insertUser.run('error_user',            'secret_sauce', 'visual',      null);
    insertUser.run('locked_out_user',         'secret_sauce', 'standard',    'Epic sadface: Sorry, this user has been locked out.');

    const count = db.prepare('SELECT COUNT(*) as total FROM users').get() as { total: number};
    console.log(`Total users: ${count.total}`);

    db.close();
})

test('Read Data from database', async ({}) => {
    const db = new Database(DB_PATH);

    const allUsers = db.prepare('SELECT * FROM users').all() as {
        id: number,
        username: string,
        password: string,
        role: string,
        expected_error: string | null
    }[];

    const standardUser = db.prepare(
            'SELECT * FROM users WHERE role =?'
        ).get('standard') as {
            username: string,
            password: string,
        };

    console.log(`All users in database ${allUsers.length}`);
    allUsers.forEach(user => {
        console.log(`
            Id: ${user.id}
            Username: ${user.username}
            Password: ${user.password}
            Role: ${user.role}
            Error: ${user.expected_error ?? 'None'}
            `);
    });
    
    console.log(`Standar user username is ${standardUser.username}`);
    console.log(`Standar user password is ${standardUser.password}`);
    
    db.close();
})