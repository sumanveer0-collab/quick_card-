import { Injectable, Inject, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.provider';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly isDemoMode: boolean;

  constructor(
    @Inject(CLOUDINARY) private readonly cloudinaryClient: typeof cloudinary,
  ) {
    // Detect demo/placeholder credentials — skip real uploads in this mode
    const apiKey = process.env.CLOUDINARY_API_KEY || '';
    this.isDemoMode = !apiKey || apiKey === 'demo' || apiKey.startsWith('demo');
    if (this.isDemoMode) {
      this.logger.warn('Cloudinary running in DEMO mode — uploads will be skipped. Set real credentials in .env to enable.');
    }
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    publicId?: string,
    resourceType: 'image' | 'raw' | 'auto' = 'image',
  ): Promise<UploadApiResponse> {
    // In demo mode, return a mock response instead of hitting the API
    if (this.isDemoMode) {
      this.logger.debug(`Demo mode: skipping Cloudinary upload for ${publicId || 'unknown'}`);
      return {
        secure_url: '',
        public_id: publicId || '',
        url: '',
        asset_id: '',
        version: 0,
        version_id: '',
        signature: '',
        width: 0,
        height: 0,
        format: 'png',
        resource_type: resourceType,
        created_at: new Date().toISOString(),
        tags: [],
        bytes: buffer.length,
        type: 'upload',
        etag: '',
        placeholder: false,
        original_filename: publicId || '',
        api_key: '',
      } as unknown as UploadApiResponse;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryClient.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: resourceType,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error', error);
            return reject(error);
          }
          resolve(result);
        },
      );

      // Convert buffer to readable stream without streamifier
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async uploadFromUrl(url: string, folder: string): Promise<UploadApiResponse> {
    if (this.isDemoMode) {
      this.logger.debug('Demo mode: skipping Cloudinary uploadFromUrl');
      return { secure_url: '', public_id: '', url: '' } as unknown as UploadApiResponse;
    }
    return this.cloudinaryClient.uploader.upload(url, { folder });
  }

  async deleteFile(publicId: string): Promise<void> {
    if (this.isDemoMode) return;
    await this.cloudinaryClient.uploader.destroy(publicId);
  }

  getOptimizedUrl(
    publicId: string,
    width = 800,
    quality: string | number = 'auto',
  ): string {
    return this.cloudinaryClient.url(publicId, {
      transformation: [{ width, quality, fetch_format: 'auto' }],
    });
  }
}
