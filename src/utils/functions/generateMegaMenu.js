import { Mobile, Cpu, Headphone, Airpods, Watch, Box } from 'iconsax-reactjs';

export function generateMegaMenu(products) {
  const categoryIcons = { mobile: Mobile, digital: Cpu, headphone: Headphone, airpods: Airpods, watch: Watch };

  const categories = [
    ...new Map(
      products.map((product) => [
        product.category,
        {
          key: product.category,
          title: product.category_fa,
          icon: categoryIcons[product.category] || Box,
        },
      ])
    ).values(),
  ];

  // محتوا
  const content = {};

  categories.forEach((category) => {
    const categoryProducts = products.filter((product) => product.category.toLowerCase() === category.key?.toLowerCase());

    const brands = [...new Set(categoryProducts.map((product) => product.brand))];

    content[category.key] = [
      {
        title: 'برندها',
        items: brands.map((brand) => ({
          title: brand,
          href: `/brand/${brand.toLowerCase()}`,
        })),
      },
      {
        title: 'جدیدترین محصولات',
        items: categoryProducts
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 8)
          .map((product) => ({
            title: product.name,
            href: `/product/${product?.category}/${product.slug}`,
          })),
      },
      {
        title: 'پرفروش‌ترین‌ها',
        items: [...categoryProducts]
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 8)
          .map((product) => ({
            title: product.name,
            href: `/product/${product?.category}/${product.slug}`,
          })),
      },
    ];
  });

  return {
    sidebar: categories,
    content,
  };
}
