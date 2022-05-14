export type ChapterInfo = {
  url: string;
  number?: number;
};

export type Chapter = {
  content?: string;
  title?: string;
} & ChapterInfo;

export type Novel = {
  id: string;
  title: string;
  alternativeTitles: string;
  slug: string;
  imageUrl: string;
  rating: number;
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
  getAllNovels(): Promise<Novel[]>;
  getNovelBySlug(slug: string): Promise<Novel | null>;
}
