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
        } else {
          // Relative tanpa slash: favicon-anichin.webp
          favicon = `${origin}/${favicon}`;
        }
      }

      // const domain = new URL(url).hostname;
      // Image: pakai OG image dari meta tag
      let image = $('meta[property="og:image"]').attr('content') || '';

      // If empty image, use favicon as image
      if (!image) {
        image = favicon;
      }

      // Handle relative URL for image
      if (image && !image.startsWith('http')) {
        const { origin } = new URL(url);
        if (image.startsWith('//')) {
          image = `https:${image}`;
        } else if (image.startsWith('/')) {
          image = `${origin}${image}`;
        } else {
          image = `${origin}/${image}`;
        }
      }

      return { title, description, image, favicon };
    } catch {
      throw new Error('Failed to fetch metadata');
    }
  }
}
