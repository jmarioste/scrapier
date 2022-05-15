import { FreeWebNovelScraper } from "./FreeWebNovelScraper";

describe("FreeWebNovelScraper", () => {
  const scrap = new FreeWebNovelScraper("reformation-of-the-deadbeat-noble");
  test("should not be null ", () => {
    expect(scrap).not.toBe(null);
  });

  test("getFirstChapterInfo should return values", async () => {
    const chapter = await scrap.getFirstChapterInfo();
    expect(1).toBe(1);
    expect(chapter?.number).toBe(1);
    expect(chapter?.url).toBeTruthy();
  });

  test("getLatestChapterInfo should  return values", async () => {
    const chapter = await scrap.getLatestChapterInfo();
    if (chapter) {
      expect(chapter.number).toBeGreaterThanOrEqual(1200);
      expect(chapter.url).toBeTruthy();
    }
  });

  test("getAllChaptersInfo should return values", async () => {
    const chapters = await scrap.getAllChaptersInfo();

    expect(chapters.length).toBeGreaterThanOrEqual(1200);
  });

  test("Get getChaptersInfoFromRange to return correct values", async () => {
    const chapters = await scrap.getChaptersInfoFromRange(1, 5);

    expect(chapters.length).toBeGreaterThanOrEqual(5);
  });

  test("Get getChaptersInfoFromRange to return correct values", async () => {
    const chapters = await scrap.getChaptersInfoFromRange(3200, 3210);

    expect(chapters.length).toBeGreaterThanOrEqual(11);
  });

  test("Get getSlugsByPage to return correct values", async () => {
    const slugs = await scrap.getSlugsByPage(1);

    expect(slugs.length).toBeLessThanOrEqual(20);
  });

  // test("Get getAllSlugs to return correct values", async () => {
  //   const slugs = await scrap.getAllSlugs();

  //   expect(slugs.length).toBeGreaterThanOrEqual(1900);
  // });

  test("Get getNovelBySlug to return novel", async () => {
    const novel = await scrap.getNovelBySlug("reformation-of-the-deadbeat-noble");
    if (novel) {
      expect(novel.title).toBe("Reformation of the Deadbeat Noble");
      expect(novel.description).toContain("Irene Pareira");
      expect(novel.description).toContain("decades.");
      expect(novel.authors).toContain("GREEN_MAN");
      expect(novel.authors?.length).toEqual(2);
      expect(novel.rating?.rating).toEqual(4.0);
      expect(novel.rating?.votes).toEqual(3);
      expect(novel.type).toContain("Korean Novel");
      expect(novel.genres).toContain("Martial Arts");
      expect(novel.genres).toContain("Action");
      expect(novel.genres).toContain("Drama");
      expect(novel.status).toBe("OnGoing");
      expect(novel.imageUrl).toBe("https://freewebnovel.com/files/article/image/1/1961/1961s.jpg");
    }
  });
});
