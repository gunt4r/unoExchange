import Link from 'next/link';

export default function MyLink({ href, children, classNames, opacity, ...props }: { href: string; children: React.ReactNode; classNames?: string; opacity?: boolean; [x: string]: any }) {
  return <Link className={`${classNames} transition-all duration-300 ${opacity ? 'hover:opacity-50' : ''}`} href={href} {...props}>{children}</Link>;
}
