export interface Movie {
  id: string;
  title: string;
  description: string;
  image: string;
  genre: string;
  videoUrl: string;
  releaseYear?: number;
  rating?: number;
  type?: string;
  subtitleEnUrl?: string | null;
  subtitleSwUrl?: string | null;
}
