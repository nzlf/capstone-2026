const supabase = require('../config/supabase');

const Product = {
  // Mengambil semua produk
  async findAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*'); // Ambil semua kolom termasuk 'tipe'
      
    if (error) throw error;
    return data;
  },

  // Mengambil satu produk berdasarkan id_product
  async findById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id_product', id) // Disesuaikan dengan nama kolom di ERD
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Menambahkan produk baru
  async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select(); // .select() berguna untuk mengembalikan data yang baru saja dimasukkan
      
    if (error) throw error;
    return data;
  },

  // Memperbarui data produk
  async update(id, updateData) {
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id_product', id)
      .select();
      
    if (error) throw error;
    return data;
  },

  // Menghapus produk
  async delete(id) {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id_product', id)
      .select();

    if (error) throw error;
    return data;
  }
};

module.exports = Product;