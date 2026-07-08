const Project = require('../models/Project');

const createNewProject = async (req, res) => {
  try {
    const { id_user, nama_project, deskripsi } = req.body;

    if (!id_user || !nama_project) {
      return res.status(400).json({
        success: false,
        message: 'id_user dan nama_project wajib diisi!'
      });
    }

    const newProject = await Project.createProject({
      id_user,
      nama_project,
      deskripsi,
      status: 'briefing'
    });

    res.status(201).json({
      success: true,
      message: 'Proyek berhasil dibuat',
      data: newProject
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat proyek',
      error: error.message
    });
  }
};

const getDetailProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.getProjectDetails(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data proyek',
      error: error.message
    });
  }
};

module.exports = {
  createNewProject,
  getDetailProject
};