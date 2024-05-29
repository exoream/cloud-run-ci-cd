class UserCore {
    constructor(id, name, username, email, password, confirmPassword, role, otp, otpExpiredTime) {
      this.id = id;
      this.name = name;
      this.username = username;
      this.email = email;
      this.password = password;
      this.confirmPassword = confirmPassword;
      this.role = role;
      this.otp = otp;
      this.otpExpiredTime = otpExpiredTime;
    }
  }
  
  module.exports = UserCore;
  