export interface Page {
  id: number;
  imageUrl: string;
}

export interface Chapter {
  id: number;
  title: string;
  pages: Page[];
}

export interface Manhwa {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  genres: string[];
  chapters: Chapter[];
  isTrending?: boolean;
}
