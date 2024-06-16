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
      "heroImage": {
        "asset": heroimage.asset->url,
        "altText": heroimage.altText
      },
      "whoWeAre": {
        heading,
        "photo": {
          "asset": whoWeAre.photo.asset->url,
          "altText": whoWeAre.photo.altText
        },
        content
      }
    }[0]`,
  );

  return data;
}
