import { showOrganizationDetailsPage, organizationsPage } from './controller/organizations.js';
import { projectsPage, showProjectDetailsPage } from './controller/projects.js';
import { getCategories, getCategoryProjects } from './controller/categories.js';
import { getHome } from './controller/index.js';
import express from 'express';

// Route for organization details page
const router = express.Router();

router.get('/', getHome);
router.get('/organizations', organizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', projectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', getCategories);
router.get('/category/:id', getCategoryProjects);

export default router;