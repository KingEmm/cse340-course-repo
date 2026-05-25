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
const getUpcomingProjects = async(number_of_projects) => {
    const query = `
         SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name
        FROM projects p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_date > CURRENT_DATE
        ORDER BY p.project_date
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getProjectDetails = async (Id) => {
    const query = `
        SELECT p.project_id , p.title, p.description, p.location, p.project_date, p.organization_id, o.name
        FROM projects p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [Id]);

    return result.rows[0];
};

export {getAllProjects, getUpcomingProjects, getProjectsByOrganizationId, getProjectDetails};