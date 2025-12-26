import { Button } from '@headlessui/react';

export default function MyButton({ children, ...props }: { children: React.ReactNode; [x: string]: any }) {
  return <Button className="transition-all duration-300 hover:opacity-50" {...props}>{children}</Button>;
}
