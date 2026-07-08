const VideoAndComment = require('../models/VideoAndComment');

// Fungsi 1: Admin mengunggah video ke suatu proyek
const uploadVideo = async (req, res) => {
  try {
    const { id_project, file_video } = req.body;

    if (!id_project || !file_video) {
      return res.status(400).json({
        success: false,
        message: 'id_project dan file_video wajib diisi!'
      });
    }

    // 1. Simpan data video ke database
    const newVideo = await VideoAndComment.addVideo({
      id_project,
      file_video,
      status: 'siap review' // Langsung set status video agar klien bisa mereview
    });

    // 2. Otomatis ubah status proyek di Kanban menjadi 'review'
    await VideoAndComment.updateProjectStatus(id_project, 'review');

    res.status(201).json({
      success: true,
      message: 'Video berhasil diunggah dan proyek masuk ke tahap Review',
      data: newVideo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengunggah video',
      error: error.message
    });
  }
};

// Fungsi 2: Klien menambahkan komentar revisi pada video
const addRevisionComment = async (req, res) => {
  try {
    const { id_video, id_user, isi_komentar, timestamps_videos } = req.body;

    if (!id_video || !id_user || !isi_komentar || !timestamps_videos) {
      return res.status(400).json({
        success: false,
        message: 'Data komentar tidak lengkap (butuh id_video, id_user, isi_komentar, dan timestamps)!'
      });
    }

    const newComment = await VideoAndComment.addComment({
      id_video,
      id_user,
      isi_komentar,
      timestamps_videos,
      status: 'pending' // Status default komentar revisi baru
    });

    res.status(201).json({
      success: true,
      message: 'Komentar revisi berhasil ditambahkan',
      data: newComment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengirim komentar revisi',
      error: error.message
    });
  }
};

module.exports = {
  uploadVideo,
  addRevisionComment
};