import db from './db.js'

const getAllProjects = async() => {
    const query = `
         SELECT o.name, p.title, p.description, p.location, p.project_date
      FROM projects p
      JOIN organization o ON p.organization_id = o.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}