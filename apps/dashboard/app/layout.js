import './globals.css';

export const metadata = {
  title: 'DSA Auto Sync - Dashboard',
  description: 'Track your DSA progress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
