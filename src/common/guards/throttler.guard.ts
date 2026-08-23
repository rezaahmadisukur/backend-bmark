import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// Custom guard — hanya untuk mengganti pesan error 429 yang lebih ramah
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected errorMessage = 'Too many requests, please try again later.';
}
