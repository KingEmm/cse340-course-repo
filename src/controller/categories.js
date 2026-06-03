import { body, validationResult } from 'express-validator';
import { getAllCategories, getProjectsByCategoryId  } from '../models/categories.js';

const categoryValidation = [
    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Please select a valid category')
];

const getCategories = async (req, res) => {
  const title = 'Categories';
  const categories = await getAllCategories();
  console.log(categories);
  res.render('categories', { title, categories });
};

const getCategoryProjects = async (req, res) => {
  const categoryId = req.params.id;
  if(!/^\d+$/.test(categoryId)) {
    const err = new Error('Invalid category ID "Please provide a valid numeric ID"');
    err.status = 400;
    next(err);
  }
  const projects = await getProjectsByCategoryId(categoryId);
    if (!projects.length) {
        const err = new Error('Category not found');
        err.status = 404;
        next(err);
    }
    console.log(projects);
    const title = projects[0].category_name + ' Projects' ;
    res.render('category', { title, projects });
};

export { getCategories, getCategoryProjects, categoryValidation };