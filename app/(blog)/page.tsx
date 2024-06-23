/* eslint-disable @next/next/no-img-element */
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getHomePage } from "../../sanity/sanity-utils";

export default async function Page() {
  const homePage = await getHomePage();
  console.log(homePage); // Log the homePage object to debug the data

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  // Set up the image URL builder
  const builder = imageUrlBuilder({
    projectId: projectId || "default-projectId",
    dataset: dataset || "default-dataset",
  });

  // Function to get the URL of an image
  function urlFor(source?: SanityImageSource) {
    let url = "";
    if (source) {
      url = builder.image(source).url();
      console.log("Image URL:", url);
    } else {
      url = "https://picsum.photos/500/500";
    }

    return url;
  }

  return (
    <>
      <section className="hero">
        <h1 className="visually-hidden">{homePage.title}</h1>
        {homePage.homePageHeroImage?.asset ? (
          <img
            src={urlFor(homePage.homePageHeroImage.asset)}
            alt={homePage.homePageHeroImage.altText || "Hero image"}
          />
        ) : (
          <p>Hero image not available</p>
        )}
      </section>

      <section id="who-we-are">
        <h2>Who We Are</h2>
        <div className="two-cols">
          {homePage.whoWeAre?.photo?.asset && (
            <img
              src={urlFor(homePage.whoWeAre.photo.asset)}
              alt={homePage.whoWeAre.photo.altText || "Who we are image"}
            />
          )}
          {homePage.whoWeAre?.content && (
            <div className="normal-copy">
              <PortableText value={homePage.whoWeAre.content} />
            </div>
          )}
        </div>
      </section>

      <section id="what-we-do">
        <h2>{homePage.whatWeDo?.heading}</h2>
        <div className="image-gallery">
          {homePage.whatWeDo?.whatWeDoPics?.map((pic, index) => (
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
          {homePage.bikePlan?.content && (
            <div className="normal-copy">
              <PortableText value={homePage.bikePlan.content} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
