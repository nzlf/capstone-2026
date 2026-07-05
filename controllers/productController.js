const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data produk',
      error: error.message
    });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    // Menangkap data dari body request
    const { nama_product, deskripsi, harga, stok, tipe } = req.body;

    // Validasi sederhana: pastikan kolom wajib tidak kosong
    if (!nama_product || !harga || !tipe) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nama produk, harga, dan tipe wajib diisi!' 
      });
    }

    // Validasi tipe (sesuai CHECK constraint di database Anda)
    if (!['jasa', 'merchandise'].includes(tipe.toLowerCase())) {
        return res.status(400).json({ 
          success: false, 
          message: 'Tipe produk hanya boleh "jasa" atau "merchandise"' 
        });
    }

    // Panggil model untuk insert ke Supabase
    const newProduct = await Product.create({
      nama_product,
      deskripsi,
      harga,
      stok: stok || 0, // Jika stok tidak diisi, default 0
      tipe: tipe.toLowerCase()
    });

    // Kembalikan respons sukses
    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: newProduct[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan produk',
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.update(id, req.body);
    
    if (updatedProduct.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Produk berhasil diupdate', data: updatedProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update produk', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.delete(id);
    
    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus produk', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct
};