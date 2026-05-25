import { getProjectDetails, getUpcomingProjects } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;
 
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

export { projectsPage, showProjectDetailsPage };