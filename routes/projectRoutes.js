const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Endpoint membuat project baru: POST /api/projects
router.post('/', projectController.createNewProject);

// Endpoint melihat detail project: GET /api/projects/:id
router.get('/:id', projectController.getDetailProject);

module.exports = router;