'use client';
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ArrowDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from '@/libs/I18nNavigation';

export const LocaleSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (event: any) => {
    router.push(`/${event.target.value}${pathname}`);
    router.refresh();
  };
  return (
    <Menu>
      <MenuButton
        className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/20 duration-300 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:opacity-80 data-open:bg-gray-700 ${className}`}
      >
        {locale.toUpperCase()}
        <ArrowDown
          className="size-4 fill-white/60"
        />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="flex w-52 origin-top-right flex-col gap-1 rounded-xl border border-white/5 bg-white/20 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <Button
            onClick={handleChange}
            value="en"
            className="group flex w-full cursor-pointer items-center gap-2 rounded-lg bg-zinc-500/10 px-3 py-1.5 transition-all duration-300 data-focus:bg-zinc-700/70"

          >
            English
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            onClick={handleChange}
            value="ru"
            className="group flex w-full cursor-pointer items-center gap-2 rounded-lg bg-zinc-500/10 px-3 py-1.5 transition-all duration-300 data-focus:bg-zinc-700/70"

          >
            Русский
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            onClick={handleChange}
            value="ua"
            className="group flex w-full cursor-pointer items-center gap-2 rounded-lg bg-zinc-500/10 px-3 py-1.5 transition-all duration-300 data-focus:bg-zinc-700/70"

          >
            Український
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            onClick={handleChange}
            value="pl"
            className="group flex w-full cursor-pointer items-center gap-2 rounded-lg bg-zinc-500/10 px-3 py-1.5 transition-all duration-300 data-focus:bg-zinc-700/70"
          >
            Polski
          </Button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
