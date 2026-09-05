import './globals.css';

export const metadata = {
  title: '2026 Primos Trivia Derby',
  description: 'Multiplayer trivia horse race for the 2026 Primos Fantasy League draft order.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
