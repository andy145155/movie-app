import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ITmdbMovieVideoDetails } from './interface';
import { TMDB_VIDEO_TYPE } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (text: string | undefined, len: number) => {
  if (!text) {
    return '';
  }
  return text?.length > len ? text.substring(0, len - 1) + '...' : text;
};

export const findTrailer = (videoArray: ITmdbMovieVideoDetails[]) => {
  return videoArray.find((video) => video.type === TMDB_VIDEO_TYPE.TRAILER);
};
