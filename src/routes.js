import { showOrganizationDetailsPage, organizationsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, editOrganizationForm, showOrganizationForm } from './controller/organizations.js';
import { projectsPage, showProjectDetailsPage, createAProject, createProjectView, projectValidation, showAssignCategoriesForm, assignCategoryToProject, showEditProjectForm, processEditProjectForm } from './controller/projects.js';
import { getCategories, getCategoryProjects, categoryValidation, categoryEditForm, editCategory } from './controller/categories.js';
import { getHome } from './controller/index.js';
import express from 'express';

// Route for organization details page
const router = express.Router();

router.get('/', getHome);
router.get('/organizations', organizationsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, editOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', projectsPage);
router.get('/new-project', createProjectView);
router.post('/new-project', projectValidation, createAProject);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', getCategories);
router.get('/category/:id', getCategoryProjects);
router.get('/edit-category/:id', categoryEditForm);
router.post('/edit-category/:id', categoryValidation, editCategory);
router.get('/assign-category/:id', showAssignCategoriesForm);
router.post('/assign-category/:id',categoryValidation , assignCategoryToProject);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

export default router;