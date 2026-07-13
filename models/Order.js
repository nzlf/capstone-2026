const supabase = require('../config/supabase');

const Order = {
  // 1. Membuat data induk pesanan (orders)
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // 2. Memasukkan item-item ke detail pesanan (order_detail) secara massal (bulk insert)
  async createOrderDetails(detailsData) {
    const { data, error } = await supabase
      .from('order_detail')
      .insert(detailsData)
      .select();

    if (error) throw error;
    return data;
  },

  // 3. Mengambil riwayat pesanan berdasarkan ID User (untuk fitur riwayat transaksi)
  async findByUserId(id_user) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_detail (
          id_detail,
          id_product,
          jumlah,
          harga_satuan,
          subtotal,
          products (nama_product, tipe, deskripsi)
        )
      `)
      .eq('id_user', id_user)
      .order('tanggal_order', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 4. Mengambil semua pesanan (untuk admin)
  async findAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_detail (
          id_detail,
          id_product,
          jumlah,
          harga_satuan,
          subtotal,
          products (nama_product, tipe, deskripsi)
        ),
        payment (
          metode,
          bukti_pembayaran,
          status
        ),
        users (
          name,
          email,
          whatsapp_number
        )
      `)
      .order('tanggal_order', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 5. Memperbarui pesanan (status, resi, dll)
  async update(id_order, updateData) {
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id_order', id_order)
      .select();

    if (error) throw error;
    return data;
  },

  // 6. Menghapus pesanan
  async delete(id_order) {
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id_order', id_order)
      .select();

    if (error) throw error;
    return data;
  }
};

module.exports = Order;