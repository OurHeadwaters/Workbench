import { useState, useEffect } from "react";

export type EaglePhotoId = "eagle-sky-1" | "eagle-sky-2" | "eagle-flight";

export interface EaglePhoto {
  id: EaglePhotoId;
  label: string;
  filename: string;
  alt: string;
  objectPosition: string;
}

export const EAGLE_PHOTOS: EaglePhoto[] = [
  {
    id: "eagle-sky-1",
    label: "Sky — soaring",
    filename: "eagle-sky-1-1920x1080.jpg",
    alt: "A bald eagle soaring high against a brilliant blue sky",
    objectPosition: "center 40%",
  },
  {
    id: "eagle-sky-2",
    label: "Sky — wide",
    filename: "eagle-sky-2-2400x900.jpg",
    alt: "A bald eagle gliding across a wide open sky",
    objectPosition: "center 35%",
  },
  {
    id: "eagle-flight",
    label: "In flight",
    filename: "eagle-flight-1920x1080.jpg",
    alt: "A bald eagle in powerful flight",
    objectPosition: "center 50%",
  },
];

const STORAGE_KEY = "headwaters-eagle-photo";

export function useEaglePhoto() {
  const [photoId, setPhotoId] = useState<EaglePhotoId>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && EAGLE_PHOTOS.some((p) => p.id === stored)) {
        return stored as EaglePhotoId;
      }
    } catch {
    }
    return "eagle-sky-1";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, photoId);
    } catch {
    }
  }, [photoId]);

  const photo = EAGLE_PHOTOS.find((p) => p.id === photoId) ?? EAGLE_PHOTOS[0];

  return { photoId, setPhotoId, photo };
}
