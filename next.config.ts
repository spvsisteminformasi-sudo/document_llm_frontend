import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
};

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);
export default withNextIntl(nextConfig);
