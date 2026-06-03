import { body, validationResult } from 'express-validator';
import { getProjectDetails, getUpcomingProjects, createProject, getAllProjectsName, getCategoriesByServiceProjectId, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories, updateCategoryAssignments, assignProjectCategory, updateProjectCategory } from '../models/categories.js'


const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .toDate()
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .toInt()
        .isInt().withMessage('Organization must be a valid integer')
];

const projectsPage = async (req, res) => {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        console.log(projects);
        res.render('projects', { title, projects });
}

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const title = 'Project Details';
    console.log(projectDetails);
    res.render('project', { title, projectDetails });
}

const createProjectView = async (req, res) => {
    const title = 'Create New Project';
    const organizations = await getAllOrganizations();
    res.render('create-project', { title, organizations });
};

const createAProject = async (req, res) => {
      console.log('Received form data:', req.body);
     // Check for validation errors
    const results = validationResult(req);
    console.log('Validation results:', results);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }
    const { title, description, location, date, organizationId } = req.body;
    const projectId = await createProject(title, description, location, date, organizationId);
    
     // Set a success flash message
    req.flash('success', 'Project added successfully!');   

    res.redirect(`/project/${projectId}`);
};

const showAssignCategoriesForm = async (req, res) => {
    const param  = req.params.id;

    const project = await getAllProjectsName(param);
    const categories = await getAllCategories();
    const project_category = await getCategoriesByServiceProjectId(param);
    
    const title = `Select ${project.title} Category`;
    console.log(project);

    res.render('assign-category', { title, project, categories, project_category });
}

const assignCategoryToProject = async (req, res) => {
    const projectId = req.params.id;
    const categoryId = req.body.category_id;

    const result = validationResult(categoryId);
    if (!result.isEmpty()) {
        req.flash('error', 'Invalid category selection');
        return res.redirect(`/assign-category/${projectId}`);
    }

    try {
        let len = await getCategoriesByServiceProjectId(projectId);
        console.log(typeof(len));
        len = len.length;
        console.log('Existing categories for project:', len);
        if( len > 0) {
            console.log('Updating category:', categoryId, 'for project:', projectId);
            await updateProjectCategory(projectId, categoryId);
        } else {
            console.log('Assigning category:', categoryId, 'to project:', projectId);
            await assignProjectCategory(projectId, categoryId);
        }
        // console.log(`Category ${categoryId} assigned to project ${projectId}`);
        req.flash('success', 'Category assigned successfully!');
        // console.log(`Category ${categoryId} assigned to project ${projectId}`);
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error assigning category:', error);
        req.flash('error', 'An error occurred while assigning the category');
        res.redirect(`/assign-category/${projectId}`);
    }
}

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    const title = 'Edit Project';
    // console.log(projectDetails);
    res.render('edit-project', { title, projectDetails, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;
    // console.log('Received form data for editing:', req.body);
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log('Validation errors:', result.array());
        result.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }
    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'An error occurred while updating the project');
        res.redirect(`/edit-project/${projectId}`);
    }
};

export { projectsPage, showProjectDetailsPage, createAProject, createProjectView, projectValidation, showAssignCategoriesForm, assignCategoryToProject, showEditProjectForm, processEditProjectForm };