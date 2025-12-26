'use client';
export default function Container({ children, classNames, ...props }: { children: React.ReactNode; classNames?: string; [x: string]: any }) {
  return (
    <div
      {...props}
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${classNames}`}
    >
      {children}
    </div>
  );
}
