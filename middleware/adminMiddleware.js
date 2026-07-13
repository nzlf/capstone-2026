const adminMiddleware = (req, res, next) => {
  // Memastikan req.user sudah ada
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Akses Ditolak! Pengguna tidak terautentikasi.'
    });
  }

  // Cek apakah role-nya adalah admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Akses Ditolak! Fitur ini hanya untuk Admin.'
    });
  }

  // Jika admin, persilakan lanjut ke controller
  next();
};

module.exports = adminMiddleware;