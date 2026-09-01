import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});

const EMAIL = 'admin@bmark.app';
const PASSWORD = 'password123';

async function ensureTag(name: string, color: string) {
  return prisma.tag.upsert({
    where: {
      name: name, // Tag global & name unique
    },
    update: {
      color: color,
    },
    create: {
      name: name,
      color: color,
    },
  });
}

async function main() {
  // User dev (idempotent via upsert by email)
  const hashed = await bcrypt.hash(PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: {
      email: EMAIL,
    },
    update: {
      password: hashed,
    },
    create: {
      email: EMAIL,
      password: hashed,
      name: 'Administrator',
    },
  });

  // Bersihkan data lama milik dev user (biar bisa jalan ulang)
  await prisma.bookmark.deleteMany({
    where: {
      userId: user.id,
    },
  });
  await prisma.collection.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Tags global
  const tagNames: {
    name: string;
    color: string;
  }[] = [
    { name: 'nextjs', color: '#000000' },
    { name: 'react', color: '#61DAFB' },
    { name: 'frontend', color: '#818cf8' },
    { name: 'css', color: '#38bdf8' },
    { name: 'tailwind', color: '#38BDF8' },
    { name: 'typescript', color: '#3178C6' },
    { name: 'backend', color: '#34d399' },
    { name: 'database', color: '#34d399' },
    { name: 'devops', color: '#fb923c' },
    { name: 'docker', color: '#2496ED' },
    { name: 'design', color: '#f472b6' },
    { name: 'ui', color: '#f472b6' },
    { name: 'learning', color: '#60a5fa' },
    { name: 'nodejs', color: '#3E863D' },
    { name: 'javascript', color: '#F7DF1E' },
  ];
  const tags = await Promise.all(
    tagNames.map((t) => ensureTag(t.name, t.color)),
  );
  const tagId = Object.fromEntries(tags.map((t) => [t.name, t.id]));

  // Collections (matching warna mock dulu)
  const cols = await Promise.all([
    prisma.collection.create({
      data: {
        userId: user.id,
        name: 'frontend',
        description: 'Frontend development resources',
        color: '#818cf8',
      },
    }),
    prisma.collection.create({
      data: {
        userId: user.id,
        name: 'backend',
        description: 'Backend development resources',
        color: '#34d399',
      },
    }),
    prisma.collection.create({
      data: {
        userId: user.id,
        name: 'devops',
        description: 'DevOps and infrastructure',
        color: '#fb923c',
      },
    }),
    prisma.collection.create({
      data: {
        userId: user.id,
        name: 'design',
        description: 'Design resources',
        color: '#f472b6',
      },
    }),
    prisma.collection.create({
      data: {
        userId: user.id,
        name: 'learning',
        description: 'Learning materials',
        color: '#60a5fa',
      },
    }),
  ]);
  const colId = Object.fromEntries(cols.map((c) => [c.name, c.id]));

  // Bookmarks (pakai tag & collection yang baru dibuat)
  await prisma.bookmark.createMany({
    data: [
      {
        url: 'https://nextjs.org/docs',
        title: 'Next.js Documentation',
        description: 'The React framework for the web.',
        image: 'https://nextjs.org/static/twitter-cards/home.jpg',
        favicon: 'https://nextjs.org/favicon.ico',
        isFavorite: true,
        userId: user.id,
        collectionId: colId['frontend'],
      },
      {
        url: 'https://tailwindcss.com/docs',
        title: 'Tailwind CSS Docs',
        description: 'A utility-first CSS framework.',
        image: 'https://tailwindcss.com/api/og?path=/docs/installation',
        favicon: 'https://tailwindcss.com/favicons/favicon.ico',
        isFavorite: true,
        userId: user.id,
        collectionId: colId['frontend'],
      },
      {
        url: 'https://www.typescriptlang.org/docs/',
        title: 'TypeScript Handbook',
        description: 'Typed JavaScript at scale.',
        image: 'https://www.typescriptlang.org/images/og-image.png',
        favicon: 'https://www.typescriptlang.org/favicon-32x32.png',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['learning'],
      },
      {
        url: 'https://www.prisma.io/docs',
        title: 'Prisma ORM Documentation',
        description: 'Next-generation Node.js and TypeScript ORM.',
        image: 'https://www.prisma.io/docs/social/docs-social.png',
        favicon: 'https://www.prisma.io/images/favicon-32x32.png',
        isFavorite: true,
        userId: user.id,
        collectionId: colId['backend'],
      },
      {
        url: 'https://docs.docker.com',
        title: 'Docker Documentation',
        description: 'Official Docker docs.',
        image:
          'https://docs.docker.com/assets/images/docker-docs-share-image.png',
        favicon: 'https://docs.docker.com/favicons/docs@2x.ico',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['devops'],
      },
      {
        url: 'https://ui.shadcn.com',
        title: 'shadcn/ui Components',
        description:
          'Beautifully designed components, accessible & open source.',
        image: 'https://ui.shadcn.com/og.jpg',
        favicon: 'https://ui.shadcn.com/favicon.ico',
        isFavorite: true,
        userId: user.id,
        collectionId: colId['design'],
      },
      {
        url: 'https://vite.dev/guide',
        title: 'Vite — Next Generation Frontend Tooling',
        description: 'A fast and lean development server.',
        image: 'https://vite.dev/og.png',
        favicon: 'https://vitejs.dev/logo.svg',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['frontend'],
      },
      {
        url: 'https://nodejs.org/en/docs',
        title: 'Node.js Documentation',
        description: 'JavaScript runtime built on Chrome V8.',
        image: 'https://nodejs.org/static/images/logo-hexagon.svg',
        favicon: 'https://nodejs.org/favicon.ico',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['backend'],
      },
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        title: 'MDN Web Docs — HTML',
        description: 'Reference for HyperText Markup Language.',
        image: 'https://developer.mozilla.org/mdn-social-share.png',
        favicon: 'https://developer.mozilla.org/favicon-48x48.png',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['learning'],
      },
      {
        url: 'https://reactjs.org',
        title: 'React — A JavaScript library for building UIs',
        description: 'The library for web and native user interfaces.',
        image: 'https://reactjs.org/og-image.png',
        favicon: 'https://reactjs.org/favicon.ico',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['frontend'],
      },
      {
        url: 'https://vercel.com/docs',
        title: 'Vercel Documentation',
        description: 'Platform to deploy and scale web apps.',
        image:
          'https://assets.vercel.com/image/upload/frontend/footer/logotype.svg',
        favicon: 'https://vercel.com/favicon.ico',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['devops'],
      },
      {
        url: 'https://www.figma.com/blog',
        title: 'Figma Blog',
        description: 'Insights on design and collaboration.',
        image:
          'https://www.figma.com/blog/wp-content/uploads/2023/08/behind-the-scenes.png',
        favicon: 'https://www.figma.com/apple-touch-icon.png',
        isFavorite: true,
        userId: user.id,
        collectionId: colId['design'],
      },
      {
        url: 'https://www.smashingmagazine.com',
        title: 'Smashing Magazine',
        description: 'Resources for web designers and developers.',
        image:
          'https://www.smashingmagazine.com/images/smashing-apple-touch-icon.png',
        favicon: 'https://www.smashingmagazine.com/images/favicon.png',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['design'],
      },
      {
        url: 'https://docs.github.com/en',
        title: 'GitHub Docs',
        description: 'Documentation for GitHub features and workflows.',
        image:
          'https://github.githubassets.com/images/modules/open_graph/github-logo.png',
        favicon: 'https://github.githubassets.com/favicons/favicon.svg',
        isFavorite: false,
        userId: user.id,
        collectionId: colId['learning'],
      },
    ],
  });

  // Hubungkan tag ke bookmark (BookmarkTag)
  const bms = await prisma.bookmark.findMany({
    where: {
      userId: user.id,
    },
  });

  const bmTags: Record<string, string[]> = {
    'Next.js Documentation': ['nextjs', 'react', 'frontend'],
    'Tailwind CSS Docs': ['css', 'tailwind', 'frontend', 'design'],
    'TypeScript Handbook': ['typescript', 'frontend', 'backend', 'learning'],
    'Prisma ORM Documentation': ['backend', 'database', 'typescript'],
    'Docker Documentation': ['devops', 'docker'],
    'shadcn/ui Components': ['ui', 'react', 'frontend', 'design'],
    'Vite — Next Generation Frontend Tooling': ['frontend', 'design'],
    'Node.js Documentation': ['backend', 'nodejs', 'javascript'],
    'MDN Web Docs — HTML': ['frontend', 'learning'],
    'React — A JavaScript library for building UIs': ['react', 'frontend'],
    'Vercel Documentation': ['devops'],
    'Figma Blog': ['design', 'ui'],
    'Smashing Magazine': ['design'],
    'GitHub Docs': ['learning'],
  };

  for (const bm of bms) {
    const names = bmTags[bm.title] ?? [];
    await prisma.bookmarkTag.createMany({
      data: names.map((n) => ({
        bookmarkId: bm.id,
        tagId: tagId[n],
      })),
    });
  }

  console.log(`✅ Seed selesai. Login: ${EMAIL} / ${PASSWORD}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
