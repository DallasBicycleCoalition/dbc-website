import "../css-reset.css";
import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  PortableText,
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { draftMode } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

import AlertBanner from "./alert-banner";

import type { SettingsQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { getLayout } from "@/sanity/sanity-utils";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

const builder = imageUrlBuilder({
  projectId: projectId || "default-projectId",
  dataset: dataset || "default-dataset",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

async function Header() {
  const data = await getLayout();
  console.log("layout Object:", data);

  if (!data) {
    return null;
  }

  function urlFor(source: SanityImageSource | undefined) {
    return source
      ? builder.image(source).url()
      : "https://picsum.photos/500/500";
  }

  return (
    <header>
      <Link href={data.landingPageLink || "/"}>
        {data.logo && (
          <img
            src={urlFor(data.logo.asset)}
            alt={data.logo.altText || "Logo"}
          />
        )}
      </Link>
    </header>
  );
}

async function Footer() {
  const data = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
  });
  const footer = data?.footer || [];

  return (
    <footer>
      <div>
        {footer.length > 0 ? (
          <PortableText value={footer as PortableTextBlock[]} />
        ) : (
          <div></div>
        )}
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <section className="min-h-screen">
          {draftMode().isEnabled && <AlertBanner />}
          <Suspense>
            <Header />
          </Suspense>
          <main>{children}</main>
          <Suspense>
            <Footer />
          </Suspense>
        </section>
        {draftMode().isEnabled && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
