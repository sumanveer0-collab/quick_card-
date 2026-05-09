import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { UserPlan } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── Email Auth ───────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.userService.create({ ...dto, password: hashedPassword });
    const tokens = await this.generateTokens(user._id.toString(), user.email, user.plan);
    this.logger.log(`Registered: ${user.email}`);
    return { message: 'Registration successful', data: { user: this.sanitize(user), ...tokens } };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.plan);
    this.logger.log(`Login: ${user.email}`);
    return { message: 'Login successful', data: { user: this.sanitize(user), ...tokens } };
  }

  // ─── OTP Auth ─────────────────────────────────────────────────────────────

  async sendOtp(dto: SendOtpDto) {
    const otp = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Upsert user by phone
    let user = await this.userService.findByPhone(dto.phone);
    if (!user) {
      user = await this.userService.create({ phone: dto.phone, name: '' });
    }

    await this.userService.saveOtp(user._id.toString(), otp, otpExpiresAt);

    // Send OTP via Fast2SMS
    await this.sendSms(dto.phone, otp);

    this.logger.log(`OTP sent to ${dto.phone}`);

    // In dev mode return OTP in response for testing
    const isDev = this.configService.get('NODE_ENV') !== 'production';
    return {
      message: 'OTP sent successfully',
      data: isDev ? { otp } : null,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userService.findByPhone(dto.phone);
    if (!user) throw new BadRequestException('Phone number not found');

    if (!user.otp || !user.otpExpiresAt) {
      throw new BadRequestException('No OTP requested. Please request a new OTP.');
    }

    if (new Date() > user.otpExpiresAt) {
      throw new BadRequestException('OTP expired. Please request a new one.');
    }

    if (user.otp !== dto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Clear OTP after successful verification
    await this.userService.clearOtp(user._id.toString());

    const tokens = await this.generateTokens(user._id.toString(), user.phone, user.plan);
    this.logger.log(`OTP verified: ${dto.phone}`);
    return { message: 'Login successful', data: { user: this.sanitize(user), ...tokens } };
  }

  // ─── Refresh ──────────────────────────────────────────────────────────────

  async refreshTokens(userId: string, identifier: string, plan: string) {
    const tokens = await this.generateTokens(userId, identifier, plan);
    return { message: 'Tokens refreshed', data: tokens };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendSms(phone: string, otp: string): Promise<void> {
    const apiKey = this.configService.get<string>('FAST2SMS_API_KEY');
    if (!apiKey || apiKey === 'demo') {
      this.logger.warn(`[DEV] OTP for ${phone}: ${otp}`);
      return;
    }

    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: phone,
        }),
      });
      const result = await response.json() as any;
      if (!result.return) {
        this.logger.error(`Fast2SMS error: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      this.logger.error(`SMS send failed: ${err.message}`);
      // Don't throw — OTP is still saved, dev can use it from logs
    }
  }

  private async generateTokens(userId: string, identifier: string, plan: UserPlan | string) {
    const payload = { sub: userId, identifier, plan };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES', '7d'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private sanitize(user: any) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.otp;
    delete obj.otpExpiresAt;
    delete obj.__v;
    return obj;
  }
}
