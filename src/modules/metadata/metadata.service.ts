import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class MetadataService {
  async fetchMetadata(url: string) {
    try {
      const response = await axios.get<string>(url, {
        responseType: 'text',
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 ...' },
      });

      const $ = cheerio.load(response.data);

      // Title & description dari OG/meta tag
      const title =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text() ||
        '';
      const description =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '';

      // Favicon dari HTML
      let favicon =
        $('link[rel="icon"]').attr('href') ||
        $('link[rel="shortcut icon"]').attr('href') ||
        '';
      if (!favicon) {
        const domain = new URL(url).hostname;
        favicon = `https://${domain}/favicon.ico`;
      }
      // Handle All Genre relative URL
      if (favicon && !favicon.startsWith('http')) {
        const { origin } = new URL(url);
        if (favicon.startsWith('//')) {
          // Protocol-relative: //cdn.example.com/favicon.ico
          favicon = `https:${favicon}`;
        } else if (favicon.startsWith('/')) {
          // Root-relative: /favicon.ico
          favicon = `${origin}${favicon}`;
        }
        favicon = `${origin}/${favicon}`;
      }

      // Image: pakai thum.io (screenshot asli)
      const domain = new URL(url).hostname;
      const image = `https://image.thum.io/get/width/400/crop/400/https://${domain}`;

      return { title, description, image, favicon };
    } catch {
      throw new Error('Failed to fetch metadata');
    }
  }
}
