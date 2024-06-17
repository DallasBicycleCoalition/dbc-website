/* eslint-disable @next/next/no-img-element */
import imageUrlBuilder from "@sanity/image-url";
import { getHomePage } from "../../sanity/sanity-utils";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

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
      console.log("Image URL:", url); // Log the generated URL to debug
    } else {
      url = "http://example.com/";
    }

    return url;
  }

  return (
    <>
      <h1 className="visually-hidden">{homePage.title}</h1>
      {homePage.homePageHeroImage && homePage.homePageHeroImage.asset ? (
        <img
          src={urlFor(homePage.homePageHeroImage.asset)}
          alt={homePage.homePageHeroImage.altText || "Hero image"}
        ></img>
      ) : (
        <p>Hero image not available</p>
      )}
      <h2>Who We Are</h2>
      {homePage.whoWeAre &&
        homePage.whoWeAre.photo &&
        homePage.whoWeAre.photo.asset && (
          <img
            src={urlFor(homePage.whoWeAre.photo.asset)}
            alt={homePage.whoWeAre.photo.altText || "Who we are image"}
          ></img>
        )}
      <h2>What we do</h2>
      <h2>Dallas Bike Plan</h2>
      <p>
        The City of Dallas has been working on its new comprehensive bike plan
        for two years, and advocates are eager to pass it. We need your help to
        make sure it&rsquo;s passed, funded, and built in a reasonable timeline.
        Follow us on Instagram to stay up to date on our efforts to support a
        robust bike plan.
      </p>
    </>
  );
}
