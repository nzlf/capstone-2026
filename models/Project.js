const supabase = require('../config/supabase');

const Project = {
  // Membuat proyek baru
  async createProject(projectData) {
    const { data, error } = await supabase
      .from('project')
      .insert([projectData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Mengambil detail proyek LENGKAP beserta video dan komentar revisinya
  async getProjectDetails(id_project) {
    const { data, error } = await supabase
      .from('project')
      .select(`
        *,
        videos (
          *,
          revisi_comments (
            id_comments,
            isi_komentar,
            timestamps_videos,
            status,
            tanggal_kirim,
            users ( nama ) -- Mengambil nama user yang berkomentar
          )
        )
      `)
      .eq('id_project', id_project)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};

module.exports = Project;