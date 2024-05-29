const User = require("../model/model");
const { UserRepositoryInterface } = require("../entity/interface");
const { NotFoundError } = require("../../../utils/helper/response");
const {
  usersCoreToUsersModel,
  usersModelToUsersCore,
  listUserModelToUserCore,
} = require("../entity/mapping");

class UserRepository extends UserRepositoryInterface {
  constructor() {
    super();
    this.db = User;
  }

  async createUser(data) {
    const user = usersCoreToUsersModel(data);
    const createdUser = await User.create(user);
    const userCore = usersModelToUsersCore(createdUser);
    return userCore;
  }

  async getUserById(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const userCore = usersModelToUsersCore(user);
    return userCore;
  }

  async getAllUser() {
    const users = await User.findAll();
    const userList = listUserModelToUserCore(users);
    return userList;
  }

  async updateUserById(id, updatedData) {
    const userModel = usersCoreToUsersModel(updatedData);
    const updatedUser = await User.update(userModel, {
      where: { id: id },
    });
    if (updatedUser[0] === 0) {
      throw new NotFoundError("User not found");
    }
    return usersModelToUsersCore(updatedUser);
  }

  async deleteUserById(id) {
    const deletedUser = await User.destroy({
      where: { id: id },
    });
    if (deletedUser === 0) {
      throw new NotFoundError("User not found");
    }
    return true;
  }

  async getUserByEmail(email) {
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      return null;
    }
    const userCore = usersModelToUsersCore(user);
    return userCore;
  }

  async getUserByUsername(username) {
    const user = await User.findOne({
      where: { username: username },
    });
    if (!user) {
      return null;
    }
    const userCore = usersModelToUsersCore(user);
    return userCore;
  }

  async sendOtpEmail(email, otp, otpExpired) {
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.otp = otp;
    user.otp_expired_time = otpExpired;
    await user.save();

    const result = usersModelToUsersCore(user);
    return result;
  }

  async verifyOtpEmail(email, otp) {
    const user = await User.findOne({
      where: { email: email, otp: otp },
    });

    if (!user) {
      throw new NotFoundError("User not found or OTP is incorrect");
    }

    const result = usersModelToUsersCore(user);
    return result;
  }

  async resetOtpEmail(otp) {
    const user = await User.findOne({
      where: { otp: otp },
    });

    if (!user) {
      throw new NotFoundError("Otp not found");
    }

    user.otp = null;
    user.otp_expired_time = null;
    await user.save();

    const result = usersModelToUsersCore(user);
    return result;
  }
}

module.exports = UserRepository;
