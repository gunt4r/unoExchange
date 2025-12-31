import { setRequestLocale } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return (
    <>
      <Toaster position="bottom-right" />
      <main>
        {props.children}
      </main>
    </>
  );
}
