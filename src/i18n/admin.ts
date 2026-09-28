import type { PayloadRequest } from 'payload'

/**
 * Custom admin-panel strings, merged into Payload's own translations under the `custom`
 * namespace (see `i18n.translations` in payload.config.ts).
 */
export const adminTranslations = {
  en: {
    custom: {
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      dashboardSubtitle: "Here's what's happening with your blog.",
      newPost: 'New post',
      newPage: 'New page',
      uploadMedia: 'Upload media',
      viewSite: 'View site',
      statPosts: 'Posts',
      statPages: 'Pages',
      statMedia: 'Media files',
      statCategories: 'Categories',
      statSubmissions: 'Form submissions',
      statUsers: 'Users',
      drafts: 'drafts',
      recentPosts: 'Recent posts',
      latestSubmissions: 'Latest form submissions',
      viewAll: 'View all',
      untitled: 'Untitled',
      updated: 'Updated {{time}}',
      published: 'Published',
      draft: 'Draft',
      noPosts: 'No posts yet.',
      writeFirstPost: 'Write your first post',
      noSubmissions: "No submissions yet. They'll show up here when visitors fill in your forms.",
      formSubmission: 'Form submission',
      justNow: 'just now',
      switchLanguage: 'العربية',
      switchLanguageLabel: 'Switch the admin to Arabic',
    },
  },
  ar: {
    custom: {
      greetingMorning: 'صباح الخير',
      greetingAfternoon: 'مساء الخير',
      greetingEvening: 'مساء الخير',
      dashboardSubtitle: 'إليك آخر المستجدات في مدونتك.',
      newPost: 'مقال جديد',
      newPage: 'صفحة جديدة',
      uploadMedia: 'رفع وسائط',
      viewSite: 'عرض الموقع',
      statPosts: 'المقالات',
      statPages: 'الصفحات',
      statMedia: 'ملفات الوسائط',
      statCategories: 'التصنيفات',
      statSubmissions: 'ردود النماذج',
      statUsers: 'المستخدمون',
      drafts: 'مسودات',
      recentPosts: 'أحدث المقالات',
      latestSubmissions: 'أحدث ردود النماذج',
      viewAll: 'عرض الكل',
      untitled: 'بدون عنوان',
      updated: 'آخر تعديل {{time}}',
      published: 'منشور',
      draft: 'مسودة',
      noPosts: 'لا توجد مقالات بعد.',
      writeFirstPost: 'اكتب أول مقال',
      noSubmissions: 'لا توجد ردود بعد. ستظهر هنا عندما يملأ الزوار نماذجك.',
      formSubmission: 'رد نموذج',
      justNow: 'الآن',
      switchLanguage: 'English',
      switchLanguageLabel: 'تحويل لوحة التحكم إلى الإنجليزية',
    },
  },
}

export type AdminTranslationKey = keyof (typeof adminTranslations)['en']['custom']

type TFunction = (key: string, vars?: Record<string, unknown>) => string

/**
 * Typed wrapper around Payload's `t()` for the custom strings above. Accepts the server
 * (`req.i18n`) and client (`useTranslation().i18n`) instances, whose `t` types differ.
 */
export const adminT = (
  i18n: Pick<PayloadRequest['i18n'], 'language'> & { t: (...args: never[]) => string },
  key: AdminTranslationKey,
  vars?: Record<string, unknown>,
): string => (i18n.t as unknown as TFunction)(`custom:${key}`, vars)
