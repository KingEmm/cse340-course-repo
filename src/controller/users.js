import bcrypt from 'bcrypt';
import { createUser , findUserByEmail, getAllUsers } from '../models/users.js';
import { body, validationResult } from 'express-validator';


const userValidation = [
    body('name')
        .notEmpty().withMessage('User name is required')
        .trim()
        .isLength({ max: 100 }).withMessage('User name must be at most 100 characters long'),
    body('email')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one digit')
        .matches(/^[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must be at least 8 characters long and can contain letters, digits, and special characters @$!%*?&')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access That page.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // User not found
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
        return null; // Invalid password
    }

    return user; // Authentication successful
};

const showUserRegistrationForm = (req, res) => {
    const title = 'Register';
    res.render('register', { title });
}

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect(`/`);
    } catch (error) {
        console.error('Error processing user registration:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.status(500).render('register', { title: 'Register', error: 'Failed to register user' });
    }
};

const showLoginForm = (req, res) => {
    const title = 'Login';
    res.render('login', { title });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.status(401).render('login', { title: 'Login' });
        }

        // Authentication successful
        req.session.user = user;
        req.flash('success', 'Login successful!');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error processing login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.status(500).render('login', { title: 'Login' });
    }
};

const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error processing logout:', err);
            req.flash('error', 'An error occurred during logout. Please try again.');
            return res.status(500).redirect('/');
        }
        // req.flash('success', 'You have been logged out.');
        res.redirect('/');
    });
};

const showDashboard = (req, res) => {
    const title = 'Dashboard';
    res.render('dashboard', { title, req });
}

const showUsersPage = async (req, res) => {
    const title = 'Admin';
    const users = await getAllUsers();
    // console.log(`Users: ${JSON.stringify(users)}`);
    res.render('users', { title, users, req });
}

export { userValidation, requireRole, requireLogin, showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, showDashboard, showUsersPage };
// The hash looks like: $2b$10$N9qo8uLOickgx2ZMRZoMye...
// console.log(passwordHash);