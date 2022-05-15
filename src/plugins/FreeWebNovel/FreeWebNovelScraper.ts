import axios, { AxiosError } from "axios";
import cheerio from "cheerio";
import { ChapterInfo, Novel, NovelScraper, Rating } from "src/types";

const BASE_URL = "https://freewebnovel.com/";

export class FreeWebNovelScraper implements NovelScraper {
  $: cheerio.Root;
  constructor(private slug: string) {}

  handleError(e: unknown) {
    if (e instanceof AxiosError) {
      console.log(e.message);
    }
  }

  private async load(url: string) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    this.$ = $;
    return $;
  }

  private toChapter(elem: cheerio.Element) {
    const $ = this.$;
    const url = $(elem).attr("href") ?? "";
    const number = url?.match(/(?!chapter-)\d+/)?.shift() ?? "";

    return {
      url,
      number: parseInt(number) ?? null,
    } as ChapterInfo;
  }
  async getFirstChapterInfo(): Promise<ChapterInfo | null> {
    const novelUrl = `${BASE_URL}${this.slug}.html`;
    try {
      const $ = await this.load(novelUrl);
      const chapters = $(".m-newest2 > ul > li > a:first")
        .map((_, elem) => this.toChapter(elem))
        .get();

      return chapters.shift() || null;
    } catch (e) {
      this.handleError(e);
      return null;
    }
  }

  async getLatestChapterInfo(): Promise<ChapterInfo | null> {
    const novelUrl = `${BASE_URL}${this.slug}.html`;
    try {
      const $ = await this.load(novelUrl);
      const chapter = $(".m-newest1 > ul > li > a:first")
        .map((_, elem) => this.toChapter(elem))
        .get();

      return chapter?.shift() ?? null;
    } catch (e) {
      this.handleError(e);
    }
    return null;
  }

  async getAllChaptersInfo(): Promise<ChapterInfo[]> {
    const latest = await this.getLatestChapterInfo();
    if (!latest) return [];

    const temp = new Array(latest?.number).fill("x");

    const chapters = temp.map<ChapterInfo>((_, number) => {
      const url = `${BASE_URL}/${this.slug}/chapter-${number}.html`;
      return {
        url,
        number,
      };
    });

    return chapters;
  }

  async getChaptersInfoFromRange(start: number, end?: number): Promise<ChapterInfo[]> {
    const latest = await this.getLatestChapterInfo();
    end = end ?? latest?.number;
    if (!end) return [];

    const diff = end - (start - 1);
    const temp = new Array(diff).fill(start);

    const chapters = temp.map<ChapterInfo>((start: number, index) => {
      const number = start + index;
      const url = `${BASE_URL}/${this.slug}/chapter-${index}.html`;

      return {
        url,
        number,
      };
    });

    return chapters;
  }

  /**
   * Steps:
   * Go to https://freewebnovel.com/latest-novel/
   * Check latest page from pagination
   * @returns
   */
  async getAllSlugs(): Promise<string[]> {
    const $ = await this.load(`${BASE_URL}/latest-novel/`);
    const endPage = $(".pages li > a:last")
      .map((_, elem) => {
        const page = $(elem).text() || "1";
        return parseInt(page);
      })
      .get()
      .shift() as number;

    const temp_array = new Array(endPage).fill(endPage);

    const getSlugsFromPages = temp_array.flatMap(async (_, index) => {
      const page = index + 1;
      const slugs = await this.getSlugsByPage(page);
      return slugs;
    });
    const slugs = await Promise.all(getSlugsFromPages);

    return slugs.flatMap((arr) => arr);
  }

  async getSlugsByPage(page: number): Promise<string[]> {
    const $ = await this.load(`${BASE_URL}/latest-novel/${page}`);
    const slugs = $(".ul-list1 h3.tit a")
      .map((_, elem) => {
        const href = $(elem).attr("href") ?? "";

        return href.replace(/(\/)|(\.html)/g, "");
      })
      .get() as string[];

    return slugs;
  }

  async getNovelBySlug(slug: string): Promise<Partial<Novel> | null> {
    this.slug = slug;
    const url = `${BASE_URL}${this.slug}.html`;
    try {
      await this.load(url);

      return {
        slug,
        title: this.getTitle(),
        description: this.getDescription(),
        alternativeTitles: this.getAlternativeTitles(),
        authors: this.getAuthors(),
        genres: this.getGenres(),
        type: this.getType(),
        imageUrl: this.getImageUrl(),
        status: this.getStatus(),
        rating: this.getRating(),
      };
    } catch (e) {
      this.handleError(e);
      throw e;
    }
  }

  private getTitle(): string {
    return this.getMetaProperty("og:title");
  }

  private getAlternativeTitles(): string {
    const $ = this.$;
    const text = $("span[title='Alternative names']").siblings().first().text();
    return text.replace(/\n/g, "");
  }

  private getAuthors(): string[] {
    return this.getMetaProperty("og:novel:author")
      .split(",")
      .map((item) => item.trim());
  }

  private getGenres(): string[] {
    const genres = this.getMetaProperty("og:novel:genre")
      ?.split(",")
      .map((genre) => genre.trim());

    return genres;
  }

  private getType() {
    const type = this.getMetaProperty("og:novel:category");

    return type;
  }

  private getStatus() {
    const type = this.getMetaProperty("og:novel:status");

    return type;
  }

  private getRating(): Rating {
    const $ = this.$;
    const text = $("div.score p.vote").first().text();
    const numbers = text.match(/\d(.?\d)?/g);
    if (numbers?.length === 3) {
      return {
        rating: parseFloat(numbers[0]),
        votes: parseInt(numbers[2]),
      };
    }

    return { rating: 0, votes: 0 };
  }

  private getImageUrl() {
    const imgUrl = this.getMetaProperty("og:image");
    return imgUrl;
  }

  private getDescription(): string {
    const $ = this.$;
    const description = $("div.m-desc div.txt p")
      .map((_index, elem) => {
        return $(elem).text();
      })
      .get()
      .join("\n");
    return description;
  }

  getMetaProperty(prop: string) {
    const $ = this.$;
    return $(`meta[property="${prop}"]`).attr("content") ?? "";
  }
}
