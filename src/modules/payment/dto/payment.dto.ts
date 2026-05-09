import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum PaymentGatewayChoice {
  RAZORPAY = 'razorpay',
  PHONEPE = 'phonepe',
}

export class CreatePaymentOrderDto {
  @IsNotEmpty()
  @IsEnum(PaymentGatewayChoice)
  gateway: PaymentGatewayChoice;
}

export class VerifyRazorpayDto {
  @IsNotEmpty() @IsString() razorpayOrderId: string;
  @IsNotEmpty() @IsString() razorpayPaymentId: string;
  @IsNotEmpty() @IsString() razorpaySignature: string;
}

export class PhonePeCallbackDto {
  @IsNotEmpty() @IsString() response: string;
}
