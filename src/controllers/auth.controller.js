const {User} = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTPEmail = require("../utils/sendOTPEmail");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({ name, email, password: hashedPassword, otp });
    await sendOTPEmail(email, otp);
    res.status(201).json({ message: "تم التسجيل، تفقد إيميلك للكود" });
  }
  catch (error) {    
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            status: "fail",
            message: "هذا البريد الإلكتروني مسجل لدينا بالفعل"
        });
    }
    console.error(error);
    res.status(500).json({
        status: "error",
        message: "حدث خطأ  في السيرفر"
    });
}
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) 
      return res.status(401).json({ message: "بيانات خطأ" });
  
    if (user.isVerified === false) {
    return res.status(403).json({ 
        message: "برجاء تفعيل الحساب أولا",
        isVerified: false 
    });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "SECRET_KEY");
    res.json({ token, user });
  } catch (err) { next(err); }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email, otp } });
    if (!user) return res.status(400).json({ message: "كود غير صحيح" });
    user.isVerified = true;
    user.otp = null;
    await user.save();
    res.json({ message: "تم تفعيل الحساب بنجاح" });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "هذا البريد الإلكتروني غير مسجل لدينا" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "تم إرسال كود إعادة تعيين كلمة المرور إلى إيميلك" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إرسال الكود" });
  }
};

exports.verifyResetCode = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email, otp } });

    if (!user) {
      return res.status(400).json({ 
        status: "fail", 
        message: "كود التحقق غير صحيح أو البريد الإلكتروني خطأ" 
      });
    }

    res.status(200).json({ 
      status: "success", 
      message: "كود التحقق صحيح، يمكنك الآن تغيير كلمة المرور" 
    });

  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ 
        status: "fail", 
        message: "المستخدم غير موجود" 
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    user.otp = null; 
    await user.save();

    res.status(200).json({ 
      status: "success", 
      message: "تم تغيير كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن" 
    });

  } catch (error) {
    next(error);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "لم يتم العثور على مستخدم بهذا البريد الإلكتروني"
      });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    await user.save();
    await sendOTPEmail(email, newOtp);
    res.status(200).json({
      status: "success",
      message: "تم إرسال كود جديد إلى بريدك الإلكتروني"
    });

  } catch (error) {
    next(error);
  }
};
