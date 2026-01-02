import { notFound } from 'next/navigation';

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Prevent access to /dev routes in production
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <>{children}</>;
}
