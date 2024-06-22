import { createClient, groq } from "next-sanity";
import { Homepage } from "../sanity.types.js";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

const config = {
  projectId: projectId,
  dataset: dataset,
  apiVersion: "2024-06-02",
};

export async function getHomePage(): Promise<Homepage> {
  const data = await createClient(config).fetch(
    groq`
    *[_type == "homepage"]{
      _id,
      _createdAt,
      title,
      "slug": slug.current,
      content,
      "homePageHeroImage": {
        "asset": homePageHeroImage.asset->url,
        "altText": homePageHeroImage.altText
      },
      "whoWeAre": {
        "heading": whoWeAre.heading,
        "photo": {
          "asset": whoWeAre.photo.asset->url,
          "altText": whoWeAre.photo.altText
        },
        "content" : whoWeAre.content
      },
      "whatWeDo": {
        "heading": whatWeDo.heading,
        "whatWeDoPics": whatWeDo.whatWeDoPics[] {
          "image": image.asset->url,
          "altText": altText,
          "caption": caption
        }
      },
      "bikePlan": {
        "heading": bikePlan.heading,
        "content": bikePlan.content
      }
    }[0]`,
  );

  return data;
}
