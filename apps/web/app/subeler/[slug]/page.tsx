import React from 'react';
import { notFound } from 'next/navigation';
import { branches } from '@/content/branches';
import { products } from '@/content/products';
import { createMetadata } from '@/lib/metadata';
import { BranchPageClient } from './BranchPageClient';

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return branches.map((branch) => ({
    slug: branch.slug,
  }));
}

export async function generateMetadata({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug);

  if (!branch) {
    return {};
  }

  return createMetadata({
    title: branch.name,
    description: branch.description || `${branch.city} şubemizde hizmet veriyoruz.`,
    path: `/subeler/${slug}`,
  });
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug);

  if (!branch) {
    notFound();
  }

  const featuredProducts = branch.featuredProducts
    ? branch.featuredProducts
        .map((productSlug) => products.find((p) => p.slug === productSlug))
        .filter((p): p is NonNullable<typeof p> => p !== undefined)
    : [];

  return <BranchPageClient branch={branch} featuredProducts={featuredProducts} />;
}
