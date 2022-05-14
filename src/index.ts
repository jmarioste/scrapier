import { FreeWebNovelScraper } from "./plugins";

export * from "./types";
export * from "./plugins";

const scraper = new FreeWebNovelScraper("martial-peak");

(async () => {
  const chapter = await scraper.getLatestChapterInfo();
  console.log(chapter);
})();
