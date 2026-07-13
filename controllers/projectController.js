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
      status: 'Briefing dan Pembayaran'
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

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.getAllProjects();
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil proyek', error: error.message });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const { id_user } = req.params;
    const projects = await Project.getProjectsByUser(id_user);
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil proyek', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_proof, result_link, chat_messages, review_comments } = req.body;
    
    // Only update provided fields
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (payment_proof !== undefined) updateData.payment_proof = payment_proof;
    if (result_link !== undefined) updateData.result_link = result_link;
    if (chat_messages !== undefined) updateData.chat_messages = chat_messages;
    if (review_comments !== undefined) updateData.review_comments = review_comments;

    const updated = await Project.updateProject(id, updateData);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update proyek', error: error.message });
  }
};

module.exports = {
  createNewProject,
  getDetailProject,
  getAllProjects,
  getUserProjects,
  updateProject
};