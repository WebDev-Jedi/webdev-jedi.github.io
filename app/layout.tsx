import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Private Dating | Premium Adult Dating & Livecams',
  description: 'Private Dating offers a curated portal of premium adult dating offers, live interactive cams, games, photo/video galleries, and latest dating news.',
  keywords: 'adult dating, hookup sites, mature dating, anonymous dating, verified profiles, local hookups, live cams, adult games',
  openGraph: {
    title: 'Private Dating | Premium Adult Dating & Livecams',
    description: 'Private Dating offers a curated portal of premium adult dating offers, live interactive cams, games, photo/video galleries, and latest dating news.',
    url: 'https://privatedating.com',
    siteName: 'Private Dating Hub',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&h=630&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Private Dating Premium Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Dating | Premium Adult Dating & Livecams',
    description: 'Private Dating offers a curated portal of premium adult dating offers, live interactive cams, games, photo/video galleries, and latest dating news.',
    images: ['https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&h=630&auto=format&fit=crop'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-stone-950 text-stone-100 font-sans antialiased" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('private_dating_theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('theme-light');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        {children}
      </body>
    </html>
  );
}

