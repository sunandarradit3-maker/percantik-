import './globals.css';

export const metadata = {
  title: 'DiTz Store — Percantik Wajah',
  description: 'Website percantik wajah tanpa API AI, siap deploy di Vercel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
