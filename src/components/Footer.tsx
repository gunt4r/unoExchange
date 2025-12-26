import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Logo from './Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('Header');
  const footerLinks = {
    navigation: [
      { name: t('home_link'), href: '/' },
      { name: t('news_link'), href: '/news' },
      { name: t('articles_link'), href: '/articles' },
      { name: t('contacts_link'), href: '/contacts' },
    ],
    contact: [
      { name: 'unoexchange@example.com', href: 'mailto:unoexchange@example.com' },
      { name: '000-000-000', href: 'tel:000-000-000' },
    ],
  };

  return (
    <footer className="relative border-t border-green-900/20 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Logo />
            </div>
            <p className="mb-6 max-w-sm text-gray-400">
              The world's most trusted currency conversion platform. Fast, secure, and reliable money transfers across the globe.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-white">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 transition-colors hover:text-green-400">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-white">Contacts</h4>
            <ul className="space-y-2">
              {footerLinks.contact.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 transition-colors hover:text-green-400">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-green-900/20 pt-8">
          <div className="items-center justify-between md:flex-row">
            <p className="text-center text-sm text-gray-400">
              ©
              {' '}
              {currentYear}
              {' '}
              UNOEXCHANGE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
