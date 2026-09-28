import type { Dictionary } from './en'

export const ar: Dictionary = {
  siteName: 'مدونة باسل',
  nav: {
    home: 'الرئيسية',
    search: 'بحث',
  },
  language: {
    label: 'اللغة',
    switchTo: 'English',
    switchToLabel: 'التبديل إلى الإنجليزية',
  },
  theme: {
    select: 'اختر المظهر',
    placeholder: 'المظهر',
    auto: 'تلقائي',
    light: 'فاتح',
    dark: 'داكن',
  },
  posts: {
    title: 'المقالات',
    readMore: 'اقرأ المزيد',
    published: 'تاريخ النشر',
    author: 'الكاتب',
    datePublished: 'تاريخ النشر',
    untitledCategory: 'تصنيف بدون عنوان',
    relatedPosts: 'مقالات ذات صلة',
  },
  pageRange: {
    noResults: 'لا توجد نتائج.',
    showing: 'عرض {start} - {end} من {total} {label}',
    post: 'مقال',
    posts: 'مقالات',
  },
  pagination: {
    label: 'التنقل بين الصفحات',
    previous: 'السابق',
    next: 'التالي',
    goToPrevious: 'الانتقال إلى الصفحة السابقة',
    goToNext: 'الانتقال إلى الصفحة التالية',
    morePages: 'صفحات أخرى',
  },
  search: {
    title: 'بحث',
    placeholder: 'ابحث في المقالات…',
    noResults: 'لا توجد نتائج.',
  },
  form: {
    loading: 'جاري الإرسال، يرجى الانتظار…',
    error: 'حدث خطأ ما.',
    serverError: 'خطأ في الخادم',
    required: 'هذا الحقل مطلوب',
  },
  notFound: {
    title: '404',
    message: 'الصفحة غير موجودة.',
    goHome: 'العودة للرئيسية',
  },
}
