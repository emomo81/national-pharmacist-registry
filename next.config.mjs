/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Phase-1 standalone wizard → pharmacist portal flow
      { source: "/register", destination: "/signup", permanent: false },
      { source: "/register/:path*", destination: "/signup", permanent: false },
      // Admin route renames
      { source: "/admin/submissions", destination: "/admin/registry", permanent: false },
      { source: "/admin/submissions/:id", destination: "/admin/registry/:id", permanent: false },
      { source: "/admin/export", destination: "/admin/reports", permanent: false },
    ];
  },
};

export default nextConfig;
