"use client";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Container from './common/Container';
import { gradientLowOpacity } from '@/tailwind/classes';
import Logo from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations('Header');
  const navigation = [
    { name: t('home_link'), href: '/' },
    { name: t('news_link'), href: '/news' },
    { name: t('reviews_link'), href: '/reviews' },
    { name: t('articles_link'), href: '/articles' },
    { name: t('contacts_link'), href: '/contacts' },
  ]

  return (
    <Container>
      <Disclosure
      as="nav"
      className={`relative ${gradientLowOpacity} border after:pointer-events-none after:absolute top-4 rounded-md after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10`}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
                <Logo />
            </div>
            <div className="hidden sm:flex sm:mx-auto">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = item.href === pathname;
                  return (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={classNames(
                      isActive ? 'bg-gray-950/50 text-white transition-all duration-300 hover:opacity-80' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                )
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => {

          const isActive = item.href === pathname

          return (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={classNames(
                isActive ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          )
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>

    <hr className={`mt-12 border-white/10 rounded-md`} />
    </Container>
  )
}