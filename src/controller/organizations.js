import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

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

export { showOrganizationDetailsPage };