const Order = require('../models/Order');
const Product = require('../models/Product');

const checkout = async (req, res) => {
  try {
    const { id_user, items, alamat_pengiriman } = req.body;

    if (!id_user || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Data user dan item belanja tidak boleh kosong!'
      });
    }

    let total_harga = 0;
    let hasPhysical = false;
    const detailItemsToInsert = [];

    for (const item of items) {
      const product = await Product.findById(item.id_product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produk dengan ID ${item.id_product} tidak ditemukan`
        });
      }

      if (product.tipe === 'merchandise') {
        hasPhysical = true;
        if (product.stok < item.jumlah) {
          return res.status(400).json({
            success: false,
            message: `Stok produk "${product.nama_product}" tidak mencukupi`
          });
        }
      }

      const harga_satuan = product.harga;
      const subtotal = harga_satuan * item.jumlah;
      total_harga += subtotal;

      detailItemsToInsert.push({
        id_product: item.id_product,
        jumlah: item.jumlah,
        harga_satuan: harga_satuan,
        subtotal: subtotal
      });
    }

    // Tambahkan ongkir jika ada produk fisik
    const ongkir = hasPhysical ? 15000 : 0;
    total_harga += ongkir;

    const newOrder = await Order.createOrder({
      id_user,
      total_harga,
      alamat_pengiriman: alamat_pengiriman || null,
      status: 'verifikasi pembayaran'
    });

    const finalDetailItems = detailItemsToInsert.map(detail => ({
      ...detail,
      id_order: newOrder.id_order
    }));

    const orderDetails = await Order.createOrderDetails(finalDetailItems);

    res.status(201).json({
      success: true,
      message: 'Checkout berhasil, silakan lakukan pembayaran',
      data: {
        order: newOrder,
        details: orderDetails
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Proses checkout gagal terjadi kesalahan',
      error: error.message
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { id_user } = req.params;
    const orders = await Order.findByUserId(id_user);
    
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat pesanan',
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil semua pesanan',
      error: error.message
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resi } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (resi !== undefined) updateData.resi = resi;

    const updatedOrder = await Order.update(id, updateData);
    
    if (updatedOrder.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Pesanan berhasil diupdate', data: updatedOrder[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update pesanan', error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.delete(id);
    
    if (deletedOrder.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Pesanan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus pesanan', error: error.message });
  }
};

module.exports = {
  checkout,
  getUserOrders,
  getAllOrders,
  updateOrder,
  deleteOrder
};