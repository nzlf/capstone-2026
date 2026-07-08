const supabase = require('../config/supabase');

const VideoAndComment = {
  // --- BAGIAN VIDEO ---
  async addVideo(videoData) {
    const { data, error } = await supabase
      .from('videos')
      .insert([videoData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Mengubah status proyek (misal: saat video diupload, status proyek jadi 'review')
  async updateProjectStatus(id_project, newStatus) {
    const { data, error } = await supabase
      .from('project')
      .update({ status: newStatus })
      .eq('id_project', id_project)
      .select();

    if (error) throw error;
    return data[0];
  },

  // --- BAGIAN KOMENTAR REVISI ---
  async addComment(commentData) {
    const { data, error } = await supabase
      .from('revisi_comments')
      .insert([commentData])
      .select();

    if (error) throw error;
    return data[0];
  }
};

module.exports = VideoAndComment;