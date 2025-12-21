import Link from "next/link";
export default function MyLink({ href, children, classNames, opacity }: { href: string; children: React.ReactNode, classNames?: string, opacity?: boolean }) {
  return <Link className={`${classNames} transition-all duration-300 ${opacity ? 'hover:opacity-50' : ''}`} href={href}>{children}</Link>;
}