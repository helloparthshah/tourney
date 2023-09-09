/** @type {import('next').NextConfig} */
// allow images from lh3.googleusercontent.com
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    env: {
        TEST_USER: process.env.TEST_USER,
    },
}

module.exports = nextConfig
