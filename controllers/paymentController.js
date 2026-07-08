const Payment = require('../models/Payment');

const processPayment = async (req, res) => {
  try {
    const { id_order, metode, total_harga, bukti_pembayaran } = req.body;

    // 1. Validasi kolom wajib 
    if (!id_order || !metode || !total_harga) {
      return res.status(400).json({
        success: false,
        message: 'id_order, metode, dan total_harga wajib diisi!'
      });
    }

    // 2. Validasi nilai metode pembayaran
    const validMethods = ['transfer', 'e-wallet', 'kartu'];
    if (!validMethods.includes(metode.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: 'Metode pembayaran harus berupa: transfer, e-wallet, atau kartu'
        });
    }

    // 3. Validasi khusus jika metode adalah 'transfer'
    if (metode.toLowerCase() === 'transfer' && !bukti_pembayaran) {
        return res.status(400).json({
            success: false,
            message: 'Bukti pembayaran (URL gambar) wajib dilampirkan untuk metode transfer!'
        });
    }

    // 4. Proses Insert ke tabel payment (Status langsung diset 'sukses')
    const newPayment = await Payment.createPayment({
      id_order,
      metode: metode.toLowerCase(),
      total_harga,
      bukti_pembayaran: bukti_pembayaran || null,
      status: 'sukses' 
    });

    // 5. Proses Update status di tabel orders menjadi 'dibayar'
    await Payment.updateOrderStatus(id_order, 'dibayar');

    // 6. Kirim respons sukses ke klien
    res.status(201).json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi dan status pesanan telah diperbarui',
      data: newPayment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses pembayaran',
      error: error.message
    });
  }
};

module.exports = {
  processPayment
};