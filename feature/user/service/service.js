const { UserServicesInterface } = require("../entity/interface");
const {
  ValidationError,
  NotFoundError,
} = require("../../../utils/helper/response");
const { createToken } = require("../../../utils/jwt/jwt");
const validator = require("validator");
const {
  generatePasswordHash,
  comparePasswordHash,
} = require("../../../utils/helper/bcrypt");
const sendOtp = require("../../../utils/email/send_otp");
const { message } = require("../../../utils/constanta/constanta");
const { generateOTP } = require("../../../utils/helper/otp");

class UserService extends UserServicesInterface {
  constructor(userRepo) {
    super();
    this.userRepo = userRepo;
  }

  async createUser(data) {
    // Validate required fields
    if (
      !data.name ||
      !data.username ||
      !data.email ||
      !data.password ||
      !data.confirmPassword
    ) {
      throw new ValidationError(message.ERROR_REQUIRED_FIELD);
    }

    // Validate password length
    if (data.password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long");
    }

    // Validate password and confirm password
    if (data.password !== data.confirmPassword) {
      throw new ValidationError(
        "Password and Confirm Password must be the same"
      );
    }

    // Validate email
    if (!validator.isEmail(data.email)) {
      throw new ValidationError("Email is not valid");
    }

    // Check if email is already registered
    const exitingUser = await this.userRepo.getUserByEmail(data.email);
    if (exitingUser) {
      throw new ValidationError("Email already registered");
    }

    // Check if username is already registered
    const existingUserByUsername = await this.userRepo.getUserByUsername(
      data.username
    );
    if (existingUserByUsername) {
      throw new ValidationError("Username already exists");
    }

    // Hash password
    const hashedPassword = await generatePasswordHash(data.password);
    data.password = hashedPassword;
    data.role = "user";
    const user = await this.userRepo.createUser(data);
    return user;
  }

  async getUserById(id) {
    if (!id) {
      throw new ValidationError(message.ERROR_ID);
    }

    if (!validator.isUUID(id)) {
      throw new ValidationError(message.ERROT_ID_INVALID);
    }

    const user = await this.userRepo.getUserById(id);
    return user;
  }

  async getAllUser() {
    const users = await this.userRepo.getAllUser();
    if (users.length === 0) {
      throw new ValidationError("No user found");
    }
    return users;
  }

  async updateUserById(id, updatedData) {
    if (!id) {
      throw new ValidationError(message.ERROR_ID);
    }

    if (!validator.isUUID(id)) {
      throw new ValidationError(message.ERROT_ID_INVALID);
    }

    // Check if email is already registered
    if (updatedData.email) {
      if (!validator.isEmail(updatedData.email)) {
        throw new ValidationError("Email is not valid");
      }

      const existingEmail = await this.userRepo.getUserByEmail(
        updatedData.email
      );
      if (existingEmail && existingEmail.id !== id) {
        throw new ValidationError("Email already registered");
      }
    }

    // Check if username is already registered
    if (updatedData.username) {
      const existingUsername = await this.userRepo.getUserByUsername(
        updatedData.username
      );
      if (existingUsername && existingUsername.id !== id) {
        throw new ValidationError("Username already exists");
      }
    }

    const user = await this.userRepo.updateUserById(id, updatedData);
    return user;
  }

  async deleteUserById(id) {
    if (!id) {
      throw new ValidationError(message.ERROR_ID);
    }

    if (!validator.isUUID(id)) {
      throw new ValidationError(message.ERROT_ID_INVALID);
    }

    const user = await this.userRepo.deleteUserById(id);
    return user;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new ValidationError(message.ERROR_REQUIRED_FIELD);
    }

    if (!validator.isEmail(email)) {
      throw new ValidationError("Email is not valid");
    }

    const user = await this.userRepo.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Email not registered");
    }
    console.log("user", user);
    const isValidPassword = await comparePasswordHash(password, user.password);
    if (!isValidPassword) {
      throw new ValidationError("Password is incorrect");
    }

    const token = createToken(user.id, user.role);
    console.log("id", user.id, "role", user.role);
    return { user, token };
  }

  async updatePassword(id, oldPassword, newPassword, confirmPassword) {
    if (!id) {
      throw new ValidationError(message.ERROR_ID);
    }

    if (!validator.isUUID(id)) {
      throw new ValidationError(message.ERROT_ID_INVALID);
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new ValidationError(message.ERROR_REQUIRED_FIELD);
    }

    if (newPassword.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long");
    }

    if (newPassword !== confirmPassword) {
      throw new ValidationError(
        "Password and Confirm Password must be the same"
      );
    }

    const user = await this.userRepo.getUserById(id);
    const isValidPassword = await comparePasswordHash(
      oldPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new ValidationError("Old password is incorrect");
    }

    const hashedPassword = await generatePasswordHash(newPassword);
    const updatedUser = await this.userRepo.updateUserById(id, {
      password: hashedPassword,
    });

    return updatedUser;
  }

  async sendOtpEmail(email) {
    if (!email) {
      throw new ValidationError(message.ERROR_REQUIRED_FIELD);
    }

    if (!validator.isEmail(email)) {
      throw new ValidationError("Email is not valid");
    }

    const otp = generateOTP();
    const otpExpired = Date.now() + 10 * 60 * 1000;

    const user = await this.userRepo.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Email not registered");
    }

    await this.userRepo.sendOtpEmail(email, otp, otpExpired);
    sendOtp(email, otp).then(() => {
      console.log(`Email sent to ${email}`);
    }).catch((error) => {
      console.error(`Error sending email to ${email}:`, error);
    });

    return null;
  }

  async verifyOtpEmail(email, otp) {
    if (!email || !otp) {
      throw new ValidationError(message.ERROR_REQUIRED_FIELD);
    }

    if(!validator.isEmail(email)) {
      throw new ValidationError("Email is not valid");
    }
    
    const result = await this.userRepo.getUserByEmail(email);
    if (!result) {
      throw new NotFoundError("Email not registered");
    }

    const uppercaseOTP = otp.toUpperCase();

    if (result.otp_expired_time < Date.now()) {
      throw new ValidationError("OTP is expired");
    }

    if (result.otp !== uppercaseOTP ) {
      throw new ValidationError("OTP is incorrect");
    }

    await this.userRepo.resetOtpEmail(otp);

    return null;
  }

  async newPassword(email, password, confirmPassword) {
    if (!email || !password || !confirmPassword) {
      throw new ValidationError(message.ERROR_REQUIRED_FIELD);
    }

    if(!validator.isEmail(email)) {
      throw new ValidationError("Email is not valid");
    }

    if (password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long");
    }

    if (password !== confirmPassword) {
      throw new ValidationError(
        "Password and Confirm Password must be the same"
      );
    }

    const hashedPassword = await generatePasswordHash(password);
    const user = await this.userRepo.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Email not registered");
    }

    await this.userRepo.updateUserById(user.id, { password: hashedPassword });

    return null;
  }
}

module.exports = UserService;
