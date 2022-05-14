import { FreeWebNovelScraper } from "./FreeWebNovelScraper";

describe("FreeWebNovelScraper", () => {
  const scrap = new FreeWebNovelScraper("martial-peak");
  test("should not be null ", () => {
    expect(scrap).not.toBe(null);
  });

  test("Get getLatestChapterInfo cto return values", async () => {
    const chapter = await scrap.getLatestChapterInfo();
    if (chapter) {
      expect(chapter?.number).not.toBeNaN();
      expect(chapter?.url).toBeTruthy();
    }
  });
});
