import { getAllOrganizations } from './src/models/organizations.js';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const app = express();


app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

app.get('/', async (req, res) => {
  const title = 'Home';
  res.render('home', { title });
});

app.get('/categories', async (req, res) => {
  const title = 'Categories';
  res.render('categories', { title });
});

app.get('/organizations', async (req, res) => {
  const title = 'Organisations';
  const organizations = await getAllOrganizations();
  console.log('Fetched organizations:', organizations);
  res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
  const title = 'Projects';
  res.render('projects', { title });
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