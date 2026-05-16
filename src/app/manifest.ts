import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Udarsy — منصة التعلم المغربية",
    short_name: "Udarsy",
    description: "دروس مجانية، تمارين تفاعلية وامتحانات نموذجية وفق المنهج المغربي",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3aaa6a",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
