import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit", "swissqrbill", "bcryptjs", "nodemailer"],
};

export default nextConfig;
