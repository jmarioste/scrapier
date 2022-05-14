import { FreeWebNovelScraper } from "./FreeWebNovelScraper";

describe("Name of the group", () => {
  const scrap = new FreeWebNovelScraper("martial-peak");
  test("should not be null ", () => {
    expect(scrap).not.toBe(null);
  });

  test("expect", async () => {
    const chapters = await scrap.getLatestChapterInfo();
    expect(chapters).toEqual(null);
  });
});
