import { body, validationResult } from 'express-validator';
import { getAllCategories, getProjectsByCategoryId, updateCategory, getCategoryById } from '../models/categories.js';

const categoryValidation = [
    body('name')
        .notEmpty().withMessage('Category name is required')
        .trim()
        .isLength({ max: 100 }).withMessage('Category name must be at most 100 characters long'),
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
    res.render('category', { title, projects, categoryId });
};

const categoryEditForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const title = 'Edit Category';
    res.render('edit-category', { title, category });
};

const editCategory = async (req, res) => {
    const categoryId = req.params.id;
    const name = req.body.name;

    const result = validationResult(name);
    if (!result.isEmpty()) {
        result.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/categories/${categoryId}/edit`);
    }

    try {
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'An error occurred while updating the category');
        res.redirect(`/categories/${categoryId}/edit`);
    }
};

export { getCategories, getCategoryProjects, categoryValidation, editCategory, categoryEditForm };