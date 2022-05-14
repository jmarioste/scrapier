import axios, { AxiosError } from "axios";
import cheerio from "cheerio";
import { ChapterInfo, Novel, NovelScraper } from "src/types";

const BASE_URL = "https://freewebnovel.com/";

export class FreeWebNovelScraper implements NovelScraper {
  constructor(private slug: string) {}

  handleError(e: unknown) {
    if (e instanceof AxiosError) {
      console.log(e.message);
    }
  }

  async getFirstChapterInfo(): Promise<ChapterInfo | null> {
    throw new Error("Method not implemented.");
  }

  async getLatestChapterInfo(): Promise<ChapterInfo | null> {
    const novelUrl = `${BASE_URL}${this.slug}.html`;
    try {
      const response = await axios.get(novelUrl);
      const $ = cheerio.load(response.data);
      const chapter = $(".m-newest1 > ul > li > a:first")
        .map((_, elem) => {
          const url = $(elem).attr("href") ?? "";
          const number = url?.match(/(?!chapter-)\d+/)?.shift() ?? "";

          return {
            url,
            number: parseInt(number),
          } as ChapterInfo;
        })
        .get();

      return chapter[0];
    } catch (e) {
      this.handleError(e);
    }
    return null;
  }

  async getAllChaptersInfo(): Promise<ChapterInfo[]> {
    return [];
  }
  async getChaptersInfoFromRange(start: number, end?: number): Promise<ChapterInfo[]> {
    console.log(start, end);
    return [];
  }

  async getAllNovels(): Promise<Novel[]> {
    return [];
  }

  async getNovelBySlug(slug: string): Promise<Novel | null> {
    console.log(slug);
    throw new Error("Method not implemented.");
  }
}
