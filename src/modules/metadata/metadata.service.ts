import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class MetadataService {
  async fetchMetadata(url: string) {
    try {
      // 1. Fetch HTML
      const response = await axios.get<string>(url, {
        responseType: 'text',
        timeout: 10000, // 10 second
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BookmarkBot/1.0)',
        },
      });

      const html: string = response.data;

      // 2. Parse HTML dengan cheerio
      const $ = cheerio.load(html);

      // 3. Extract meta tags
      const title =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text() ||
        '';

      const description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '';

      const image = $('meta[property="og:image"]').attr('content') || '';

      const favicon =
        $('link[rel="icon"]').attr('href') ||
        $('link[rel="shortcut icon"]').attr('href') ||
        '';

      return { title, description, image, favicon };
    } catch {
      throw new Error('Failed to fetch metadata');
    }
  }
}
