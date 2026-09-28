export const en = {
  siteName: 'Basil Blogs',
  nav: {
    home: 'Home',
    search: 'Search',
  },
  language: {
    label: 'Language',
    switchTo: 'العربية',
    switchToLabel: 'Switch to Arabic',
  },
  theme: {
    select: 'Select a theme',
    placeholder: 'Theme',
    auto: 'Auto',
    light: 'Light',
    dark: 'Dark',
  },
  posts: {
    title: 'Posts',
    readMore: 'Read more',
    published: 'Published',
    author: 'Author',
    datePublished: 'Date published',
    untitledCategory: 'Untitled category',
    relatedPosts: 'Related posts',
  },
  pageRange: {
    noResults: 'Search produced no results.',
    // {start}, {end} and {total} are replaced at runtime
    showing: 'Showing {start} - {end} of {total} {label}',
    post: 'post',
    posts: 'posts',
  },
  pagination: {
    label: 'pagination',
    previous: 'Previous',
    next: 'Next',
    goToPrevious: 'Go to previous page',
    goToNext: 'Go to next page',
    morePages: 'More pages',
  },
  search: {
    title: 'Search',
    placeholder: 'Search posts…',
    noResults: 'No results found.',
  },
  form: {
    loading: 'Loading, please wait…',
    error: 'Something went wrong.',
    serverError: 'Internal Server Error',
    required: 'This field is required',
  },
  notFound: {
    title: '404',
    message: 'This page could not be found.',
    goHome: 'Go home',
  },
}

export type Dictionary = typeof en
