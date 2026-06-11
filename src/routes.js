import { showOrganizationDetailsPage, organizationsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, editOrganizationForm, showOrganizationForm } from './controller/organizations.js';
import { projectsPage, showProjectDetailsPage, createAProject, createProjectView, projectValidation, showAssignCategoriesForm, assignCategoryToProject, showEditProjectForm, processEditProjectForm } from './controller/projects.js';
import { getCategories, getCategoryProjects, categoryValidation, categoryEditForm, editCategory, addACategory, addCategoryForm } from './controller/categories.js';
import { requireRole, showUserRegistrationForm, processUserRegistrationForm, userValidation, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard } from './controller/users.js';
import { getHome } from './controller/index.js';
import express from 'express';

// Route for organization details page
const router = express.Router();

router.get('/', getHome);
router.get('/organizations', organizationsPage);
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, editOrganizationForm);
router.get('/organization/:id',  showOrganizationDetailsPage);
router.get('/projects', projectsPage);
router.get('/new-project', requireRole('admin'), createProjectView);
router.post('/new-project', requireRole('admin'), projectValidation, createAProject);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', getCategories);
router.get('/add-category', requireRole('admin'), addCategoryForm);
router.post('/add-category', requireRole('admin'), categoryValidation, addACategory);
router.get('/category/:id', getCategoryProjects);
router.get('/edit-category/:id', requireRole('admin'), categoryEditForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, editCategory);
router.get('/assign-category/:id', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-category/:id', requireRole('admin'),categoryValidation , assignCategoryToProject);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.get('/register', showUserRegistrationForm);
router.post('/register', userValidation, processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;