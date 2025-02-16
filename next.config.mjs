/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        }
        return config
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://streamio-backend.onrender.com/api/v1/:path*' // Proxy to Backend
            }
        ];
    },
    images: {
        domains: ['res.cloudinary.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
