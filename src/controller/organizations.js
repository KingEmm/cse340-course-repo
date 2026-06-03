import { body, validationResult } from 'express-validator';
import { getAllOrganizations, getOrganizationById, createOrganization, editOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

export const organizationsPage = async (req, res) => {
        const organizations = await getAllOrganizations();
        // console.log(organizations);
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
 
}

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    // console.log('Fetching details for organization ID:', organizationId);
    const organization = await getOrganizationById(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = `${organization.name} - Organization Details`;
    console.log('Organization:', organization);
    res.render('organization', {title, organization, projects});
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
}

const processNewOrganizationForm = async (req, res) => {
    console.log('Received form data:', req.body);
     // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    // Set a success flash message
    req.flash('success', 'Organization added successfully!');   

    res.redirect(`/organization/${organizationId}`);
}

const showOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organization = await getOrganizationById(organizationId);
    const title = `Edit ${organization.name}`;
    res.render('edit-organization', { title, organization });
}

const editOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    console.log('Received form data for editing:', req.body);
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect(`/edit-organization/${organizationId}`);
    }
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organization = await editOrganization(organizationId, name, description, contactEmail, logoFilename);

    // Set a success flash message
    req.flash('success', 'Organization updated successfully!');   

    res.redirect(`/organization/${organizationId}`);
};

export { showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showOrganizationForm, editOrganizationForm };