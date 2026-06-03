import { getAllOrganizations, getOrganizationById } from './src/models/organizations.js';
import { getAllProjects, getProjectsByOrganizationId } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';
import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import flash from './src/middleware/flash.js';
import router from './src/routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

const SESSION_SECRET = process.env.SESSION_SECRET;

// Set up session management

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// const expres = require('express');

const app = express();

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

// Use flash message middleware
app.use(flash);

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// const route = require('./src/routes.js');


// Middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`Request: ${req.method} ${req.url}`);
  }
  next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

app.use(router);

// app.get('/categories', async (req, res) => {
//   const title = 'Categories';
//   const categories = await getAllCategories();
//   console.log(categories);
//   res.render('categories', { title, categories });
// });

// app.get('/organizations', async (req, res) => {
//   const title = 'Organisations';
//   const organizations = await getAllOrganizations();
//   // console.log('Fetched organizations:', organizations);
//   res.render('organizations', { title, organizations });
// });

// app.get('/organization/:id', async (req, res, next) => {
//   const id = req.params.id;
//   if(!/^\d+$/.test(id)) {
//     const err = new Error('Invalid organization ID');
//     err.status = 400;
//     next(err);
//   }
//   console.log('Fetching organization with ID:', id);
//   const organization = await getOrganizationById(parseInt(id));
//   const projects = await getProjectsByOrganizationId(parseInt(id));
//   console.log('Fetched projects:', projects);
//   if (!organization) {
//     const err = new Error('Organization not found');
//     err.status = 404;
//     next(err);
//   }
//   const title = organization ? organization.name : 'Organization Not Found';
//   console.log('Fetched organization:', organization);
//   res.render('organization', { title, organization, projects });
// });

// app.get('/projects', async (req, res) => {
//   console.log(req.query['name']);
//   const title = 'Projects';
//   const projects = await getAllProjects();
//   // console.log('Fetched projects:', projects);
//   res.render('projects', { title, projects });
// });

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});

// app.listen(PORT, () => {
//   console.log(`Server is running at http://127.0.0.1:${PORT}`);
//   console.log(`Environment: ${NODE_ENV}`);
// });

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});