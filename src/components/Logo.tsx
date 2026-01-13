import MyLink from './common/Link';
import Image from 'next/image';

export default function Logo({ classNames}: { classNames?: string }) {
  return (<MyLink opacity href="/" classNames={`text-white flex gap-2 text-[clamp(1.1rem,2.5vw,1.5rem)] font-bold ${classNames}`}>UNOEXCHANGE <Image className="relative rounded-lg opacity-70 object-cover"  src="/assets/images/unoexchange.svg" alt="logo" width={37} height={20} /></MyLink>);
}
