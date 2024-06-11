import Link from 'next/link';
import { Suspense } from 'react';

import Avatar from './avatar';
import CoverImage from './cover-image';
import MoreStories from './more-stories';
import PortableText from './portable-text';

import type { HeroQueryResult, SettingsQueryResult } from '@/sanity.types';
import * as demo from '@/sanity/lib/demo';
import { sanityFetch } from '@/sanity/lib/fetch';
import { heroQuery, settingsQuery } from '@/sanity/lib/queries';
import { getHomePage } from '../../sanity/sanity-utils';

export default async function Page() {
  const homePage = await getHomePage();

  return (
    <main>
      <h1>{homePage.title}</h1>
    </main>
  );
}
