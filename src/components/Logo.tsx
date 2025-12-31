import MyLink from './common/Link';

export default function Logo({ classNames}: { classNames?: string }) {
  return (<MyLink opacity href="/" classNames={`text-white text-[clamp(1.1rem,2.5vw,1.5rem)] font-bold ${classNames}`}>UNOEXCHANGE</MyLink>);
}
