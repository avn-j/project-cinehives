export default function Section({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`container mx-auto py-12`}>{children}</div>;
}
