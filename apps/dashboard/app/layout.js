import './globals.css';

export const metadata = {
  title: 'DSA Auto Sync - Dashboard',
  description: 'Track your DSA progress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950">{children}</body>
    </html>
  );
}
