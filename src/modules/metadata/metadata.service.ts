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
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
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
      // Fallback: return basic data so user can still save bookmark
      const { hostname } = new URL(url);
      return {
        title: hostname,
        description: '',
        image: '',
        favicon: `https://${hostname}/favicon.ico`,
      };
    }
  }
}
