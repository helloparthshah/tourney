/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        TEST_USER: process.env.TEST_USER,
    },
}

module.exports = nextConfig
