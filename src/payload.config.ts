import { postgresAdapter } from '@payloadcms/db-postgres'
import { ar } from '@payloadcms/translations/languages/ar'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Roles } from './collections/Roles'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { migrations } from './migrations'
import { adminTranslations } from './i18n/admin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // Globe button in the header that switches the admin UI language
      actions: ['@/components/AdminLanguageToggle#AdminLanguageToggle'],
    },
    dashboard: {
      widgets: [
        {
          slug: 'welcome',
          Component: '@/components/Dashboard/WelcomeWidget#WelcomeWidget',
          label: { ar: 'الترحيب', en: 'Welcome' },
          minWidth: 'medium',
        },
        {
          slug: 'stats',
          Component: '@/components/Dashboard/StatsWidget#StatsWidget',
          label: { ar: 'الإحصائيات', en: 'Statistics' },
          minWidth: 'medium',
        },
        {
          slug: 'recent-posts',
          Component: '@/components/Dashboard/RecentPostsWidget#RecentPostsWidget',
          label: { ar: 'أحدث المقالات', en: 'Recent posts' },
          minWidth: 'small',
        },
        {
          slug: 'recent-submissions',
          Component: '@/components/Dashboard/RecentSubmissionsWidget#RecentSubmissionsWidget',
          label: { ar: 'أحدث ردود النماذج', en: 'Latest form submissions' },
          minWidth: 'small',
        },
      ],
      // `collections` is Payload's built-in widget with a card per collection
      defaultLayout: [
        { widgetSlug: 'welcome', width: 'full' },
        { widgetSlug: 'stats', width: 'full' },
        { widgetSlug: 'recent-posts', width: 'medium' },
        { widgetSlug: 'recent-submissions', width: 'medium' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Run pending migrations automatically when the production server starts
    prodMigrations: migrations,
  }),
  // Admin UI language (labels, buttons…). Arabic is the default; switch from the header toggle.
  i18n: {
    fallbackLanguage: 'ar',
    supportedLanguages: { ar, en },
    translations: adminTranslations,
  },
  // Content language: fields marked `localized: true` store one value per locale
  localization: {
    locales: [
      // Each language falls back to the other while a translation is missing
      { code: 'ar', fallbackLocale: 'en', label: { ar: 'العربية', en: 'Arabic' }, rtl: true },
      { code: 'en', fallbackLocale: 'ar', label: { ar: 'الإنجليزية', en: 'English' } },
    ],
    defaultLocale: 'ar',
    fallback: true,
  },
  collections: [Pages, Posts, Media, Categories, Users, Roles],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
