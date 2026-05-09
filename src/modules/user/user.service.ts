import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserPlan } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    return new this.userModel(data).save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async saveOtp(userId: string, otp: string, otpExpiresAt: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { otp, otpExpiresAt });
  }

  async clearOtp(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { otp: null, otpExpiresAt: null });
  }

  async updatePlan(userId: string, plan: UserPlan, printReadyLimit: number, planExpiresAt?: Date) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { plan, printReadyLimit, printReadyUsed: 0, planExpiresAt: planExpiresAt || null },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async incrementPrintUsage(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { printReadyUsed: 1 } },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async incrementAiUsage(userId: string): Promise<UserDocument> {
    const today = new Date().toISOString().split('T')[0];
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.aiUsageDate !== today) {
      user.aiUsageCount = 0;
      user.aiUsageDate = today;
    }
    user.aiUsageCount += 1;
    return user.save();
  }

  async resetMonthlyUsage(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { printReadyUsed: 0 });
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password -otp -otpExpiresAt -__v').exec();
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Profile fetched', data: user };
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: data }, { new: true })
      .select('-password -otp -otpExpiresAt -__v');
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Profile updated', data: user };
  }
}
