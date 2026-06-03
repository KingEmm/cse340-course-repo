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

const getAllProjectsName = async(id) => {
    const query = `
        SELECT p.project_id, p.title, p.description
        FROM projects p
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
}

const getCategoriesByServiceProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM project_category pc
        JOIN categories c ON pc.category_id = c.category_id
        WHERE pc.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

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

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO projects (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    console.log(queryParams);
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
      UPDATE projects
      SET title = $2, description = $3, location = $4, project_date = $5, organization_id = $6
      WHERE project_id = $1
      RETURNING project_id;
    `;

    const queryParams = [id, title, description, location, date, organizationId];
    console.log(queryParams);
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

export {getAllProjects,getAllProjectsName, getUpcomingProjects, getProjectsByOrganizationId, getProjectDetails, createProject, getCategoriesByServiceProjectId, updateProject};