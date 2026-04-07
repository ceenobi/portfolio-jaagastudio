import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Responsive breakpoints for Cloudinary video optimization.
 * Each breakpoint targets a specific device tier with appropriate
 * dimensions and quality settings for optimal delivery.
 */
export const VIDEO_BREAKPOINTS = {
  mobile: { width: 640, height: 1136, quality: "auto:low" },
  tablet: { width: 1024, height: 768, quality: "auto:good" },
  desktop: { width: 1920, height: 1080, quality: "auto:best" },
} as const;

type BreakpointKey = keyof typeof VIDEO_BREAKPOINTS;

/**
 * Generates an optimized Cloudinary video URL with responsive
 * transformations for fill, format, and quality.
 */
export const getCloudinaryVideo = (
  url: string,
  width: number,
  height: number,
  quality: string = "auto",
) => {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com")) return url;
  const pathParts = url.split("upload/");
  if (pathParts.length !== 2) return url;
  return `${pathParts[0]}upload/c_fill,w_${width},h_${height},f_auto,q_${quality}/${pathParts[1]}`;
};

/**
 * Generates a Cloudinary poster/thumbnail image from a video URL.
 * Extracts a frame at the given offset for use as a loading placeholder.
 */
export const getCloudinaryVideoPoster = (
  url: string,
  width: number,
  height: number,
  offsetSeconds: number = 0,
) => {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com")) return url;
  const pathParts = url.split("upload/");
  if (pathParts.length !== 2) return url;
  // Replace video extension with .jpg for the poster image
  const posterPath = pathParts[1].replace(/\.(mp4|webm|mov|avi|mkv)$/i, ".jpg");
  return `${pathParts[0]}upload/c_fill,w_${width},h_${height},f_auto,q_auto,so_${offsetSeconds}/${posterPath}`;
};

/**
 * Returns an optimized video URL for the current device breakpoint.
 */
export const getResponsiveCloudinaryVideo = (
  url: string,
  breakpoint: BreakpointKey = "desktop",
) => {
  const bp = VIDEO_BREAKPOINTS[breakpoint];
  return getCloudinaryVideo(url, bp.width, bp.height, bp.quality);
};

export const getCloudinaryImage = (
  url: string,
  width: number,
  height: number,
) => {
  if (!url) return url;
  if (!url.includes("res.cloudinary.com")) return url;
  const pathParts = url.split("upload/");
  if (pathParts.length !== 2) return url;
  return `${
    pathParts[0]
  }upload/c_fill,w_${width},h_${height},f_auto,q_auto/${pathParts[1]}`;
};
