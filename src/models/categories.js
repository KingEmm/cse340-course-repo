import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
      FROM public.categories;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        select  c.name as category_name,p.project_id, p.title, p.description, p.organization_id, o.name as organization_name from 
        project_category pc join projects p on pc.project_id = p.project_id join
        categories c on c.category_id = pc.category_id join organization o
        on p.organization_id=o.organization_id
        where c.category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
}

const assignProjectCategory = async (projectId, categoryId) => {
    const query = `INSERT INTO project_category (category_id, project_id)
                VALUES ($1, $2)`

    await db.query(query, [categoryId, projectId])
    console.log(`Assigned category ${categoryId} to project ${projectId}`);

    // return result.rows[0].category_id;
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, delete existing category assignments for the project
    const deleteQuery = `DELETE FROM project_category WHERE project_id = $1`;
    console.log(projectId, categoryIds);
    await db.query(deleteQuery, [projectId]);

    // Then, insert new category assignments
     for (const categoryId of categoryIds) {
        await assignProjectCategory(categoryId, projectId);
    }
}

const getCategoryById = async (categoryId) => {
    const query = `SELECT category_id, name FROM categories WHERE category_id = $1`;
    const result = await db.query(query, [categoryId]);
    return result.rows[0];
}

const updateCategory = async (categoryId, name) => {
    const query = `UPDATE categories SET name = $1 WHERE category_id = $2`;
    await db.query(query, [name, categoryId]);
}

const updateProjectCategory = async (projectId, categoryId) => {
    const query = `UPDATE project_category SET category_id = $1 WHERE project_id = $2`;
    await db.query(query, [categoryId, projectId]);
}

export {getAllCategories, getProjectsByCategoryId, assignProjectCategory, updateCategoryAssignments, updateProjectCategory, updateCategory, getCategoryById}