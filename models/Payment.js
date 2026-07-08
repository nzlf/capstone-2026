const supabase = require('../config/supabase');

const Payment = {
  // 1. Menyimpan data pembayaran baru ke tabel payment
  async createPayment(paymentData) {
    const { data, error } = await supabase
      .from('payment')
      .insert([paymentData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // 2. Memperbarui status pesanan di tabel orders
  async updateOrderStatus(id_order, newStatus) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id_order', id_order)
      .select();

    if (error) throw error;
    return data[0];
  }
};

module.exports = Payment;