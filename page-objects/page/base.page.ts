import { expect, Locator, Page } from "@playwright/test";
import { Link } from '../pageelement/link';

export class BasePage {
    public readonly page: Page;
    public $link!: Link;
    protected rootSelector?: string;

    constructor(page: Page) {
        this.page = page;

    }
public async visit(url: string, uniquePageLocator: Locator, pageTitle: string) {
    await this.page.goto(url);
    await expect(uniquePageLocator).toBeVisible();
    console.log(`${pageTitle} is successfully opened`);
}

  /**
     * Wait for page is loaded for both networkidle and domcontentloaded
     */
  async waitForPageIsLoaded(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
}

public get link(): Link {
    if (!this.$link) {
        this.$link = new Link(this.page, this.rootSelector);
    }
    return this.$link;
}

}