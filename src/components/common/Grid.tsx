export default function Grid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-10 grid grid-cols-1 place-items-center gap-x-10 gap-y-20 md:grid-cols-3 ${className}`}>{children}</div>
  );
}
