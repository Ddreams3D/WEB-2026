import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizar Compra',
  description: 'Completa tu compra de forma segura.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
