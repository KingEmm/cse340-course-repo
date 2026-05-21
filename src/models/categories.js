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

export {getAllCategories, getProjectsByCategoryId}