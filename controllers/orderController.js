const Order = require('../models/Order');
const Product = require('../models/Product');

const checkout = async (req, res) => {
  try {
    // Klien mengirimkan id_user (dari auth) dan array items yang dibeli
    // Format items: [{ id_product: "...", jumlah: 2 }, { id_product: "...", jumlah: 1 }]
    const { id_user, items } = req.body;

    if (!id_user || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Data user dan item belanja tidak boleh kosong!'
      });
    }

    let total_harga = 0;
    const detailItemsToInsert = [];

    // Mengambil informasi harga asli produk dari database untuk keamanan (mencegah manipulasi harga dari frontend)
    for (const item of items) {
      const product = await Product.findById(item.id_product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produk dengan ID ${item.id_product} tidak ditemukan`
        });
      }

      // Validasi stok jika produk bertipe merchandise
      if (product.tipe === 'merchandise' && product.stok < item.jumlah) {
        return res.status(400).json({
          success: false,
          message: `Stok produk "${product.nama_product}" tidak mencukupi`
        });
      }

      const harga_satuan = product.harga;
      const subtotal = harga_satuan * item.jumlah;
      total_harga += subtotal;

      // Siapkan data untuk tabel order_detail
      detailItemsToInsert.push({
        id_product: item.id_product,
        jumlah: item.jumlah,
        harga_satuan: harga_satuan,
        subtotal: subtotal
      });
    }

    // Langkah 1: Buat data induk di tabel orders
    const newOrder = await Order.createOrder({
      id_user,
      total_harga,
      status: 'pending' // default status sesuai ERD
    });

    // Langkah 2: Masukkan id_order yang baru terbentuk ke tiap-tiap item detail
    const finalDetailItems = detailItemsToInsert.map(detail => ({
      ...detail,
      id_order: newOrder.id_order
    }));

    // Langkah 3: Simpan semua item ke tabel order_detail
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

module.exports = {
  checkout,
  getUserOrders
};