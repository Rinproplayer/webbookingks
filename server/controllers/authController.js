const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hostay_secret_key_danang_2026_secure_token_jwt', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc Register user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email này đã được đăng ký' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        partnerStatus: user.partnerStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        partnerStatus: user.partnerStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, dateOfBirth, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc Change password
// @route PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Register partner / hotelier request
// @route POST /api/auth/partner-register
const registerPartner = async (req, res, next) => {
  try {
    const { businessName, taxOrIdNumber, contactPhone, address } = req.body;
    const user = await User.findById(req.user.id);

    user.partnerStatus = 'pending';
    user.partnerInfo = {
      businessName,
      taxOrIdNumber,
      contactPhone,
      address,
      requestDate: new Date()
    };

    await user.save();

    res.json({
      success: true,
      message: 'Yêu cầu đăng ký đối tác đã gửi. Ban quản trị sẽ duyệt trong vòng 24 giờ.',
      partnerStatus: user.partnerStatus
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin get all users
// @route GET /api/auth/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc Admin toggle user block
// @route PUT /api/auth/admin/users/:id/toggle-block
const toggleUserBlock = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `Đã ${user.isBlocked ? 'khóa' : 'mở khóa'} tài khoản thành công`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin approve or reject partner
// @route PUT /api/auth/admin/partners/:id/review
const reviewPartner = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // status: 'approved' | 'rejected'
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    user.partnerStatus = status;
    if (status === 'approved') {
      user.role = 'hotelier';
      user.partnerInfo.approvedDate = new Date();
    } else {
      user.partnerInfo.rejectionReason = rejectionReason || 'Không đáp ứng điều kiện hợp tác';
    }

    await user.save();

    res.json({
      success: true,
      message: status === 'approved' ? 'Đã phê duyệt đối tác thành công' : 'Đã từ chối đối tác',
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  registerPartner,
  getAllUsers,
  toggleUserBlock,
  reviewPartner
};
