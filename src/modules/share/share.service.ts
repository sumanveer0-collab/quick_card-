import { Injectable } from '@nestjs/common';
import { CardService } from '../card/card.service';

@Injectable()
export class ShareService {
  constructor(private cardService: CardService) {}

  async getPublicCard(slug: string) {
    const card = await this.cardService.findBySlug(slug);

    // Return only public-safe fields
    const publicCard = {
      businessName: card.businessName,
      name: card.name,
      phone: card.phone,
      email: card.email,
      address: card.address,
      logoUrl: card.logoUrl,
      tagline: card.tagline,
      services: card.services,
      qrCodeUrl: card.qrCodeUrl,
      imageUrl: card.imageUrl,
      colorTheme: card.colorTheme,
      shareSlug: card.shareSlug,
      template: card.templateId,
      themeMode: card.themeMode,
    };

    return { message: 'Card fetched', data: publicCard };
  }
}
