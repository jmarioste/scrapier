export type ChapterInfo = {
  url: string;
  number?: number;
};

export type Chapter = {
  content?: string;
  title?: string;
} & ChapterInfo;

export type Rating = {
  rating: number;
  votes: number;
};
export type Novel = {
  title: string;
  alternativeTitles: string;
  slug: string;
  imageUrl: string;
  rating: Rating;
  genres: string[];
  authors: string[];
  artists?: string[];
  type: string;
  status: string;
  description: string;
};

export interface NovelScraper {
  getFirstChapterInfo(): Promise<ChapterInfo | null>;
  getLatestChapterInfo(): Promise<ChapterInfo | null>;
  getAllChaptersInfo(): Promise<ChapterInfo[]>;
  getChaptersInfoFromRange(start: number, end?: number): Promise<ChapterInfo[]>;
  getAllSlugs(): Promise<string[]>;
  getSlugsByPage(page: number): Promise<string[]>;
  getNovelBySlug(slug: string): Promise<Partial<Novel> | null>;
  getChapterByUrl(url: string): Promise<Chapter | null>;
  getChapterByNumber(number: number): Promise<Chapter | null>;
}
