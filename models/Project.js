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
  },

  // Mengambil semua proyek (untuk admin)
  async getAllProjects() {
    const { data, error } = await supabase
      .from('project')
      .select(`
        *,
        users ( name )
      `)
      .order('id_project', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mengambil semua proyek milik user tertentu
  async getProjectsByUser(id_user) {
    const { data, error } = await supabase
      .from('project')
      .select(`
        *,
        users ( name )
      `)
      .eq('id_user', id_user)
      .order('id_project', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update proyek (status, payment_proof, result_link, chat_messages)
  async updateProject(id_project, updateData) {
    const { data, error } = await supabase
      .from('project')
      .update(updateData)
      .eq('id_project', id_project)
      .select();

    if (error) throw error;
    return data[0];
  }
};

module.exports = Project;