export const PAGE_GUTTER = "mx-auto px-4 sm:px-6 lg:px-8";
// Narrower than the nav so long lists of ideas stay readable.
// Home page content, also used to align the nav logo with it.
export const HOME_WIDTH = "max-w-6xl";
export const LIST_WIDTH = "max-w-4xl";

// White band behind a list's header. Shared lists extend it with their tabs,
// personal lists have nothing below so they close it with the border.
export const LIST_HEADER_BAND = "bg-white";
export const LIST_HEADER_CLOSED = `${LIST_HEADER_BAND} border-b border-gray-200 pb-4 sm:pb-6`;

// Breathing room at the bottom of every page.
export const PAGE_BOTTOM = "pb-16 sm:pb-20";

// Content below a page header, aligned with it.
export const PAGE_BODY = `${LIST_WIDTH} ${PAGE_GUTTER} pt-8 sm:pt-10 ${PAGE_BOTTOM}`;
