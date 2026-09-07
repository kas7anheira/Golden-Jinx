import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Luís Castanheira",
    short_name: "Luís Castanheira",
    description:
      "Site profissional de Luís Castanheira, economista, empresário e sócio-gerente da Golden Jinx.",
    start_url: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#090909",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
