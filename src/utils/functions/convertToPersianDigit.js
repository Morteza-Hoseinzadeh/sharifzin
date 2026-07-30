export default function ConvertToPersianDigit(value) {
  return value?.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]) || '';
}
