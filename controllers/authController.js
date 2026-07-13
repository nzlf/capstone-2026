const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { nama, username, email, nomorWa, password } = req.body;

    if (!nama || !username || !email || !nomorWa || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findByUsernameOrEmail(username, email);

    if (existingUser) {
      return res.status(409).json({
        message: 'Username or email already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: nama,
      username,
      email,
      whatsappNumber: nomorWa,
      passwordHash,
      role: 'CLIENT',
    });

    return res.status(201).json({
      message: 'Register success',
      data: {
        id: user.id,
        nama: user.name,
        username: user.username,
        email: user.email,
        nomorWa: user.whatsapp_number,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Register failed',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Username/email and password are required',
      });
    }

    const user = await User.findByUsernameOrEmailLogin(identifier);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid username/email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid username/email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return res.json({
      message: 'Login success',
      token,
      user: {
        id: user.id,
        nama: user.name,
        username: user.username,
        email: user.email,
        nomorWa: user.whatsapp_number,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nama, username, nomorWa } = req.body;
    const userId = req.user.id;

    if (!nama || !username || !nomorWa) {
      return res.status(400).json({ message: 'Semua kolom profil wajib diisi' });
    }

    const updatedUser = await User.updateProfile(userId, {
      name: nama,
      username,
      whatsappNumber: nomorWa,
    });

    return res.json({
      message: 'Profil berhasil diperbarui',
      user: {
        id: updatedUser.id,
        nama: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        nomorWa: updatedUser.whatsapp_number,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal memperbarui profil',
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan baru wajib diisi' });
    }

    const userRecord = await User.findPasswordHashById(userId);
    if (!userRecord) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const isMatch = await bcrypt.compare(oldPassword, userRecord.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password lama salah' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(userId, newHash);

    return res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengubah password',
      error: error.message,
    });
  }
};