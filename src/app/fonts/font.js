import localFont from 'next/font/local';

export const dana = localFont({
  src: [
    {
      path: '../../../public/fonts/dana-fonts/dana-light.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/dana-fonts/dana.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/dana-fonts/dana-demibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/dana-fonts/dana-black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-dana',
});
