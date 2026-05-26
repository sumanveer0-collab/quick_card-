import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Business Card Templates | QuickCard',
  description:
    'Discover beautiful business card templates. Browse, customize, and create professional business cards in seconds.',
};

export default function BusinessCardSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
