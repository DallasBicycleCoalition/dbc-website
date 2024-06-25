import { defineType } from "sanity";

export const layoutSchema = defineType({
  name: "layout",
  title: "Layout",
  type: "document",
  fields: [
    {
      title: "Logo",
      name: "logo",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "altText",
          type: "string",
          title: "Alternative text",
        },
      ],
    },
    {
      name: "landingPageLink",
      title: "Landing Page Link",
      type: "url",
    },
  ],
});
