import './globals.css';

export const metadata = {
  title: 'DSA Sync — Analytics Dashboard',
  description: 'Premium DSA progress tracker. Track your LeetCode, GFG & CodingNinjas solutions in one place.',
  openGraph: {
    title: 'DSA Sync — Analytics Dashboard',
    description: 'Track your DSA coding progress across all platforms',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-mesh min-h-screen antialiased">{children}</body>
    </html>
  );
}
