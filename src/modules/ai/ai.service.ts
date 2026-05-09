import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { UserService } from '../user/user.service';
import { TemplateService } from '../template/template.service';
import { GenerateAiDto } from './dto/generate-ai.dto';
import { UserDocument, UserPlan } from '../user/schemas/user.schema';
import { TemplateCategory } from '../template/schemas/template.schema';

const AI_DAILY_LIMITS: Record<string, number> = {
  free: 3,
  pro: 30,
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private templateService: TemplateService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generate(dto: GenerateAiDto, user: UserDocument) {
    // Check daily AI usage limit
    await this.checkAndEnforceLimit(user);

    const prompt = this.buildPrompt(dto.name, dto.businessType);

    let aiResult: any;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional branding expert. Always respond with valid JSON only, no markdown, no explanation.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;
      aiResult = JSON.parse(content);
    } catch (error) {
      this.logger.error('OpenAI API error', error);
      throw new InternalServerErrorException('AI generation failed. Please try again.');
    }

    // Increment usage
    await this.userService.incrementAiUsage(user._id.toString());

    // Map suggested category to templates
    const category = this.mapCategory(aiResult.suggestedCategory);
    const templates = await this.templateService.findByCategory(category);

    return {
      message: 'AI generation successful',
      data: {
        ...aiResult,
        suggestedCategory: category,
        suggestedTemplates: templates.slice(0, 3).map((t) => ({
          _id: t._id,
          name: t.name,
          previewImage: t.previewImage,
          isPremium: t.isPremium,
        })),
      },
    };
  }

  private async checkAndEnforceLimit(user: UserDocument) {
    const today = new Date().toISOString().split('T')[0];
    const limit = AI_DAILY_LIMITS[user.plan] ?? 3;
    // Reset if new day
    const currentCount =
      user.aiUsageDate === today ? user.aiUsageCount : 0;

    if (currentCount >= limit) {
      throw new BadRequestException(
        `Daily AI limit reached (${limit}/day for ${user.plan} plan). Upgrade for more.`,
      );
    }
  }

  private buildPrompt(name: string, businessType: string): string {
    return `You are a professional branding expert.
Based on the following details, generate a complete business card branding package.

Owner Name: ${name}
Business Type: ${businessType}

Generate and return a JSON object with exactly these fields:
{
  "businessName": "Creative business name",
  "tagline": "Short catchy tagline (max 10 words)",
  "services": ["Service 1", "Service 2", "Service 3"],
  "suggestedCategory": "one of: corporate, creative, local, food, beauty, fitness",
  "colorTheme": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "background": "#hexcode",
    "text": "#hexcode"
  }
}

Rules:
- businessName should be professional and memorable
- tagline should be inspiring and relevant
- services should be specific to the business type
- suggestedCategory must match the business type
- colorTheme should match the industry and feel professional`;
  }

  private mapCategory(suggested: string): TemplateCategory {
    const map: Record<string, TemplateCategory> = {
      corporate: TemplateCategory.CORPORATE,
      creative: TemplateCategory.CREATIVE,
      local: TemplateCategory.LOCAL,
      food: TemplateCategory.FOOD,
      beauty: TemplateCategory.BEAUTY,
      fitness: TemplateCategory.FITNESS,
    };
    return map[suggested?.toLowerCase()] || TemplateCategory.CORPORATE;
  }
}
