export default function toSlug(text) {
  if (!text) return '';

  return text
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[^ا-یa-z0-9\-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
