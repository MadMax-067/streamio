/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
