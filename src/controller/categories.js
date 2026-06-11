import { body, validationResult } from 'express-validator';
import { getAllCategories, getProjectsByCategoryId, updateCategory, getCategoryById, addCategory } from '../models/categories.js';

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

  const result = validationResult(categoryId);
    if (!result.isEmpty()) {
        result.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/categories/${categoryId}/edit`);
    }
    try {
        const projects = await getProjectsByCategoryId(categoryId);
        console.log(`Projects for category ${categoryId}:`, projects);

        console.log(projects);
        if (projects.length === 0) {
            const category = await getCategoryById(categoryId);
            const title = category ? `${category.name} Projects` : 'Category Projects';
            return res.render('category', { title, projects: [], categoryId });
        }
        const title = projects[0].category_name + ' Projects' ;
        res.render('category', { title, projects, categoryId });
    } catch (error) {
        console.error('Error fetching category projects:', error);
        const err = new Error('Error fetching category projects');
        err.status = 500;
        next(err);
    }
};

const addCategoryForm = async (req, res) => {
    const title = 'Add Category';
    res.render('add-category', { title });
};

const addACategory = async (req, res) => {
    const name = req.body.name;

    const result = validationResult(name);
    if (!result.isEmpty()) {
        result.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/add-category`);
    }

    try {
        await addCategory(name);
        req.flash('success', 'Category added successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error adding category:', error);
        req.flash('error', 'An error occurred while adding the category');
        res.redirect(`/add-category/`);
    }
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

export { getCategories, getCategoryProjects, categoryValidation, editCategory, categoryEditForm, addCategoryForm, addACategory };