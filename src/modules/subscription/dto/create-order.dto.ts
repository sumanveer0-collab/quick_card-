import { IsEnum, IsNotEmpty } from 'class-validator';

export enum SubscriptionPlan {
  PRO = 'pro',
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}
