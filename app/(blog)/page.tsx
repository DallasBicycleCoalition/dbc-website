/* eslint-disable @next/next/no-img-element */
import imageUrlBuilder from '@sanity/image-url';
import { getHomePage } from '../../sanity/sanity-utils';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { PortableText } from '@portabletext/react';

export default async function Page() {
  const homePage = await getHomePage();
  console.log(homePage); // Log the homePage object to debug the data

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  // Set up the image URL builder
  const builder = imageUrlBuilder({
    projectId: projectId || 'default-projectId',
    dataset: dataset || 'default-dataset',
  });

  // Function to get the URL of an image
  function urlFor(source?: SanityImageSource) {
    let url = '';
    if (source) {
      url = builder.image(source).url();
      console.log('Image URL:', url); // Log the generated URL to debug
    } else {
      url = 'https://picsum.photos/500/500';
    }

    return url;
  }

  return (
    <>
      <section className="hero">
        <h1 className="visually-hidden">{homePage.title}</h1>
        {homePage.homePageHeroImage && homePage.homePageHeroImage.asset ? (
          <img
            src={urlFor(homePage.homePageHeroImage.asset)}
            alt={homePage.homePageHeroImage.altText || 'Hero image'}
          ></img>
        ) : (
          <p>Hero image not available</p>
        )}
      </section>
      <section id="who-we-are">
        <h2>Who We Are</h2>
        <div className="two-cols">
          {homePage.whoWeAre &&
            homePage.whoWeAre.photo &&
            homePage.whoWeAre.photo.asset && (
              <img
                src={urlFor(homePage.whoWeAre.photo.asset)}
                alt={homePage.whoWeAre.photo.altText || 'Who we are image'}
              ></img>
            )}
          {homePage.whoWeAre && homePage.whoWeAre.content && (
            <div className="normal-copy">
              <PortableText value={homePage.whoWeAre.content}></PortableText>
            </div>
          )}
        </div>
      </section>
      <section id="what-we-do">
        <h2>{homePage.whatWeDo?.heading}</h2>
        <div className="image-gallery">
          {homePage.whatWeDo &&
            homePage.whatWeDo.whatWeDoPics &&
            homePage.whatWeDo?.whatWeDoPics.map((pic, index) => (
              <div key={index}>
                <img src={urlFor(pic.image)} alt={pic.altText} />
                <p>{pic.caption}</p>
              </div>
            ))}
        </div>
      </section>
      <section id="bike-plan">
        <h2>{homePage.bikePlan?.heading}</h2>
        <div className="two-cols">
          {homePage.bikePlan && homePage.bikePlan.content && (
            <div className="normal-copy">
              <PortableText value={homePage.bikePlan.content}></PortableText>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
