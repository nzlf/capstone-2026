const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Endpoint membuat project baru: POST /api/projects
router.post('/', projectController.createNewProject);

// Endpoint melihat detail project: GET /api/projects/:id
router.get('/:id', projectController.getDetailProject);

// Endpoint melihat semua project (admin): GET /api/projects
router.get('/', projectController.getAllProjects);

// Endpoint melihat project user: GET /api/projects/user/:id_user
router.get('/user/:id_user', projectController.getUserProjects);

// Endpoint update project (status, dll): PUT /api/projects/:id
router.put('/:id', projectController.updateProject);

module.exports = router;