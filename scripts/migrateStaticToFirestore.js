/**
 * Migration Script: Static HTML → Firestore
 * 
 * Parses static HTML files and uploads structured content to Firebase Firestore
 * 
 * Usage: npm run migrate
 * 
 * Requires:
 * - Firebase Admin SDK service account key (path in FIREBASE_SERVICE_ACCOUNT_PATH)
 * - Environment variables in .env file
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';
import { config } from 'dotenv';

// Load environment variables
config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// Site configuration
const SITE_ID = process.env.VITE_SITE_ID || 'flip-the-switch';

// Page file mapping
const PAGE_FILES = {
  home: 'index.html',
  about: 'about.html',
  programs: 'programs.html',
  schedule: 'schedule.html',
  gallery: 'gallery.html',
  contact: 'contact.html'
};

/**
 * Parse HTML file and extract content blocks
 */
function parseHtmlFile(filename) {
  const filepath = join(ROOT_DIR, filename);
  const html = readFileSync(filepath, 'utf-8');
  const $ = load(html);
  
  const blocks = [];
  const pageTitle = $('title').text().split('—')[0].trim();
  
  // Extract hero section
  const hero = $('.hero');
  if (hero.length) {
    const heroTitle = hero.find('.hero-title').html() || '';
    const heroSubtitle = hero.find('.hero-subtitle').text().trim();
    const heroCtas = [];
    
    hero.find('.hero-ctas a, .cta-group a').each((i, el) => {
      const $el = $(el);
      heroCtas.push({
        text: $el.find('span').text() || $el.text().trim(),
        href: $el.attr('href'),
        variant: $el.hasClass('btn--yellow') ? 'yellow' : 
                 $el.hasClass('btn--outline') ? 'outline' : 'primary'
      });
    });
    
    // Parse title for highlight markers
    let parsedTitle = heroTitle
      .replace(/<span class="highlight">/g, '{highlight}')
      .replace(/<\/span>/g, '{/highlight}')
      .replace(/<br\s*\/?>/g, '\n')
      .trim();
    
    blocks.push({
      type: 'hero',
      title: parsedTitle,
      subtitle: heroSubtitle,
      ctas: heroCtas,
      backgroundImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop',
      variant: 'dark'
    });
  }
  
  // Extract intro sections
  $('.section--intro').each((i, el) => {
    const $section = $(el);
    const title = $section.find('.page-title').text().trim();
    const subtitle = $section.find('.lede').text().trim();
    
    if (title) {
      blocks.push({
        type: 'intro-section',
        title,
        subtitle
      });
    }
  });
  
  // Extract content blocks
  $('.content-block').each((i, el) => {
    const $block = $(el);
    const isReverse = $block.hasClass('content-block--reverse');
    const isDarkText = $block.find('.content-block__text--dark').length > 0;
    
    const label = $block.find('.content-block__label').text().trim();
    const title = $block.find('.content-block__title').text().trim();
    
    // Get description paragraphs
    const descriptions = [];
    $block.find('.content-block__description').each((j, desc) => {
      descriptions.push($(desc).text().trim());
    });
    
    // Get stats
    const stats = [];
    $block.find('.stat').each((j, stat) => {
      const $stat = $(stat);
      stats.push({
        number: $stat.find('.stat__number').text().trim(),
        label: $stat.find('.stat__label').text().trim()
      });
    });
    
    // Get CTA
    let cta = null;
    const $ctaBtn = $block.find('.btn').first();
    if ($ctaBtn.length) {
      cta = {
        text: $ctaBtn.find('span').text() || $ctaBtn.text().trim(),
        href: $ctaBtn.attr('href'),
        variant: $ctaBtn.hasClass('btn--yellow') ? 'yellow' : 'primary'
      };
    }
    
    // Get image placeholder label
    const placeholderLabel = $block.find('.content-block__media--placeholder').attr('data-label') || 'Image';
    
    blocks.push({
      type: 'content-block',
      label,
      title,
      description: descriptions.length === 1 ? descriptions[0] : descriptions,
      image: {
        src: null,
        alt: title,
        placeholder: placeholderLabel
      },
      cta,
      stats: stats.length > 0 ? stats : null,
      reverse: isReverse,
      darkText: isDarkText
    });
  });
  
  // Extract media rows
  $('.media-row').each((i, el) => {
    const $row = $(el);
    const items = [];
    
    $row.find('.media-row__item').each((j, item) => {
      const $item = $(item);
      const placeholder = $item.attr('data-label') || 'Image';
      const caption = $item.find('.media-row__caption').text().trim();
      
      items.push({
        src: null,
        alt: placeholder,
        caption,
        placeholder
      });
    });
    
    blocks.push({
      type: 'media-row',
      items
    });
  });
  
  // Extract image dividers
  $('.image-divider').each((i, el) => {
    const $divider = $(el);
    const placeholder = $divider.attr('data-label') || 'Full Width Image';
    
    blocks.push({
      type: 'image-divider',
      src: null,
      alt: placeholder,
      placeholder
    });
  });
  
  // Extract features sections
  $('.features').each((i, el) => {
    const $features = $(el);
    const $section = $features.closest('.section');
    const sectionTitle = $section.find('.section-title').first().text().trim();
    
    const items = [];
    $features.find('.feature').each((j, feature) => {
      const $feature = $(feature);
      items.push({
        icon: $feature.find('.icon').text().trim(),
        title: $feature.find('h3').text().trim(),
        description: $feature.find('p').text().trim()
      });
    });
    
    if (items.length > 0) {
      blocks.push({
        type: 'features',
        title: sectionTitle,
        items
      });
    }
  });
  
  // Extract programs grid
  $('.programs-grid').each((i, el) => {
    const $grid = $(el);
    const $section = $grid.closest('.section');
    const sectionTitle = $section.find('.section-title').first().text().trim();
    
    const programs = [];
    $grid.find('.program-card').each((j, card) => {
      const $card = $(card);
      const $btn = $card.find('.btn');
      
      programs.push({
        title: $card.find('h3').text().trim(),
        description: $card.find('p').text().trim(),
        cta: $btn.length ? {
          text: $btn.find('span').text() || $btn.text().trim(),
          href: $btn.attr('href'),
          variant: 'primary'
        } : null
      });
    });
    
    if (programs.length > 0) {
      blocks.push({
        type: 'programs',
        title: sectionTitle,
        programs
      });
    }
  });
  
  // Extract schedule section
  $('.schedule-grid').each((i, el) => {
    const $grid = $(el);
    const $section = $grid.closest('.section');
    const sectionTitle = $section.find('.section-title').first().text().trim();
    
    // Get filters
    const filters = [];
    $section.find('.filter-btn').each((j, btn) => {
      filters.push($(btn).text().trim());
    });
    
    // Get sessions
    const sessions = [];
    $grid.find('.session').each((j, session) => {
      const $session = $(session);
      sessions.push({
        title: $session.find('h4').clone().children().remove().end().text().trim(),
        time: $session.find('.meta').text().trim(),
        tag: $session.find('.tag').text().trim(),
        selected: $session.hasClass('session--selected')
      });
    });
    
    if (sessions.length > 0) {
      blocks.push({
        type: 'schedule',
        title: sectionTitle,
        filters,
        sessions
      });
    }
  });
  
  // Extract credentials list
  $('.credentials-list').each((i, el) => {
    const $list = $(el);
    const $section = $list.closest('.section');
    const sectionTitle = $section.find('.section-title').first().text().trim();
    
    const items = [];
    $list.find('li').each((j, li) => {
      items.push($(li).text().trim());
    });
    
    if (items.length > 0) {
      blocks.push({
        type: 'credentials',
        title: sectionTitle,
        items
      });
    }
  });
  
  // Extract CTA sections
  $('.section--alt, .section').each((i, el) => {
    const $section = $(el);
    // Only process if it has centered title and buttons but isn't already processed
    const $title = $section.find('.section-title');
    const $buttons = $section.find('.btn');
    
    if ($title.length && $buttons.length && 
        $title.css('text-align') === 'center' || 
        $section.css('text-align') === 'center' ||
        $section.attr('style')?.includes('text-align: center')) {
      
      const title = $title.text().trim();
      const description = $section.find('p').not('.section-title').first().text().trim();
      
      const buttons = [];
      $buttons.each((j, btn) => {
        const $btn = $(btn);
        buttons.push({
          text: $btn.find('span').text() || $btn.text().trim(),
          href: $btn.attr('href'),
          variant: $btn.hasClass('btn--yellow') ? 'yellow' : 
                   $btn.hasClass('btn--outline') ? 'outline' : 'primary'
        });
      });
      
      // Only add if not a duplicate
      const existingCta = blocks.find(b => b.type === 'cta' && b.title === title);
      if (!existingCta && title) {
        blocks.push({
          type: 'cta',
          title,
          description,
          buttons,
          altBackground: $section.hasClass('section--alt')
        });
      }
    }
  });
  
  return {
    id: Object.keys(PAGE_FILES).find(k => PAGE_FILES[k] === filename) || 'home',
    title: pageTitle,
    blocks
  };
}

/**
 * Extract navigation from HTML
 */
function extractNavigation(html) {
  const $ = load(html);
  
  const brand = {
    text: $('.brand').text().trim(),
    href: $('.brand').attr('href') || '/'
  };
  
  const items = [];
  $('.site-nav a').each((i, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    const text = $el.text().trim();
    
    // Convert href to page ID
    let id = href.replace('.html', '').replace('/', '');
    if (id === '' || id === 'index') id = 'home';
    
    // Convert to SPA-style href
    const spaHref = id === 'home' ? '/' : `/${id}`;
    
    items.push({ id, text, href: spaHref });
  });
  
  return { brand, items };
}

/**
 * Extract footer from HTML
 */
function extractFooter(html) {
  const $ = load(html);
  const $footer = $('.site-footer');
  
  const brand = $footer.find('strong').first().text().trim() || 'Flip The Switch Performance';
  const emailLink = $footer.find('a[href^="mailto:"]');
  const email = emailLink.length ? emailLink.attr('href').replace('mailto:', '') : 'train@fliptheswitch.co';
  
  const social = [];
  $footer.find('.social-links a').each((i, el) => {
    const $el = $(el);
    social.push({
      platform: $el.attr('aria-label') || $el.text().trim(),
      label: $el.text().trim(),
      href: $el.attr('href')
    });
  });
  
  const copyrightText = $footer.find('p').last().text().trim();
  
  return {
    brand,
    email,
    copyright: copyrightText || '© 2025 Flip The Switch. All rights reserved.',
    social
  };
}

/**
 * Generate Firestore document structure
 */
function generateFirestoreData() {
  console.log('🔄 Parsing static HTML files...\n');
  
  const data = {
    site: {
      id: SITE_ID,
      name: 'Flip The Switch Performance',
      tagline: 'Elite Performance Coaching'
    },
    pages: {},
    navigation: null,
    footer: null
  };
  
  // Parse each page
  for (const [pageId, filename] of Object.entries(PAGE_FILES)) {
    try {
      console.log(`📄 Parsing ${filename}...`);
      const pageData = parseHtmlFile(filename);
      data.pages[pageId] = pageData;
      console.log(`   ✅ Found ${pageData.blocks.length} blocks`);
    } catch (error) {
      console.error(`   ❌ Error parsing ${filename}:`, error.message);
    }
  }
  
  // Extract navigation from index.html
  try {
    const indexHtml = readFileSync(join(ROOT_DIR, 'index.html'), 'utf-8');
    data.navigation = extractNavigation(indexHtml);
    data.footer = extractFooter(indexHtml);
    console.log('\n📍 Extracted navigation and footer');
  } catch (error) {
    console.error('❌ Error extracting navigation:', error.message);
  }
  
  return data;
}

/**
 * Upload data to Firestore (requires Firebase Admin SDK)
 */
async function uploadToFirestore(data) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  
  if (!serviceAccountPath) {
    console.log('\n⚠️  FIREBASE_SERVICE_ACCOUNT_PATH not set. Skipping upload.');
    console.log('   Set this in your .env file to enable Firestore upload.');
    return false;
  }
  
  try {
    // Dynamic import for Firebase Admin
    const admin = await import('firebase-admin');
    const { readFileSync } = await import('fs');
    
    const resolvedPath = serviceAccountPath.startsWith('/') || serviceAccountPath.match(/^[A-Z]:/) 
    ? serviceAccountPath 
    : join(ROOT_DIR, serviceAccountPath);
  
  const serviceAccount = JSON.parse(
    readFileSync(resolvedPath, 'utf-8')
  );
    
    admin.default.initializeApp({
      credential: admin.default.credential.cert(serviceAccount)
    });
    
    const db = admin.default.firestore();
    
    console.log('\n☁️  Uploading to Firestore...\n');
    
    // Upload site document
    await db.doc(`sites/${SITE_ID}`).set(data.site);
    console.log(`   ✅ Site document: sites/${SITE_ID}`);
    
    // Upload pages
    for (const [pageId, pageData] of Object.entries(data.pages)) {
      await db.doc(`sites/${SITE_ID}/pages/${pageId}`).set(pageData);
      console.log(`   ✅ Page: sites/${SITE_ID}/pages/${pageId}`);
    }
    
    // Upload navigation
    if (data.navigation) {
      await db.doc(`sites/${SITE_ID}/navigation/main`).set(data.navigation);
      console.log(`   ✅ Navigation: sites/${SITE_ID}/navigation/main`);
    }
    
    // Upload footer
    if (data.footer) {
      await db.doc(`sites/${SITE_ID}/components/footer`).set(data.footer);
      console.log(`   ✅ Footer: sites/${SITE_ID}/components/footer`);
    }
    
    console.log('\n🎉 Upload complete!');
    return true;
    
  } catch (error) {
    console.error('\n❌ Firestore upload failed:', error.message);
    return false;
  }
}

/**
 * Output JSON for manual inspection/upload
 */
function outputJson(data) {
  console.log('\n📋 Generated Firestore JSON Structure:\n');
  console.log(JSON.stringify(data, null, 2));
  
  // Also write to file
  const outputPath = join(ROOT_DIR, 'firestore-data.json');
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n💾 Saved to: ${outputPath}`);
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  FLIP THE SWITCH — Static to Firestore Migration');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const data = generateFirestoreData();
  
  // Try to upload to Firestore
  const uploaded = await uploadToFirestore(data);
  
  // If not uploaded, output JSON
  if (!uploaded) {
    console.log('\n📋 Generated Firestore JSON Structure:');
    console.log('   (Copy this to your Firestore console or use Firebase CLI)\n');
    
    // Write to file for manual upload
    const outputPath = join(ROOT_DIR, 'firestore-data.json');
    writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`💾 Saved complete data to: ${outputPath}`);
  }
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  Migration Complete');
  console.log('═══════════════════════════════════════════════════════\n');
}

// Run migration
migrate().catch(console.error);

