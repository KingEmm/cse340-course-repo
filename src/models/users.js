import { query } from 'express-validator';
import db from './db.js'

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
            SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name, r.role_description
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            WHERE u.email = $1
        `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const getAllUsers = async () => {
    const Query = `
        SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
        FROM users u
        JOIN roles r ON u.role_id = r.role_id;
    `

    const result = await db.query(Query);

    return result.rows;
}

const assignProjectToUser = async (userId, projectId) => {
    const query = `insert into project_volunteer (user_id, project_id) values ($1, $2) returning user_id;`;

    const result = await db.query(query, [userId, projectId]);

    if (result.rows.length === 0) {
        throw new Error('Failed to assign Project to user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`Assigned a new user ${result.rows[0].user_id} to Project ${result.rows[0].project_id}`);
    }

    return result.rows[0].user_id;
}

const cancelVolunteerAssignment = async (userId, projectId) => {
    const query = `DELETE FROM project_volunteer WHERE user_id = $1 AND project_id = $2 RETURNING user_id;`;

    const result = await db.query(query, [userId, projectId]);

    if (result.rows.length === 0) {
        throw new Error('Failed to cancel volunteer assignment');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`Canceled volunteer assignment for user ${result.rows[0].user_id} and project ${result.rows[0].project_id}`);
    }

    return result.rows[0].user_id;
}

const checkVolunteerAssignment = async (userId, projectId) => {
    const query = `SELECT user_id, project_id from project_volunteer WHERE user_id = $1 and project_id = $2; `;

    const result = await db.query(query, [userId, projectId]);
    if (result.rows.length === 0) {
        return null; // No existing assignment, user can volunteer
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`Assigned a new user ${result.rows[0].user_id} to Project ${result.rows[0].project_id}`);
    }

    return result.rows[0].user_id
}

export { createUser, findUserByEmail, getAllUsers, checkVolunteerAssignment, assignProjectToUser, cancelVolunteerAssignment };