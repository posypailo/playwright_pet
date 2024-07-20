import { Locator, Page } from 'playwright';
import { Link } from '../../pageelement/link';

export class Viewer {
    public readonly page: Page;
    private readonly rootSelector = '[data-test-id=confluence-main-content]';
    private $link!: Link;
    private buttonEdit: Locator;

    constructor(page: Page) {
        this.page = page;
        this.buttonEdit = page.locator("[data-test-id='fabric-edit-button']");
    }

    public get link(): Link {
        if (!this.$link) {
            this.$link = new Link(this.page, this.rootSelector);
        }
        return this.$link;
    }

    async clickButtonEdit() {
        await this.buttonEdit.click();
    }

    async paragraphExists(text: string): Promise<boolean> {
        await this.page.locator(`//p[normalize-space(.)='${text}']`).waitFor({ state: 'visible' });
        // await this.page.locator(`//p[normalize-space(.)='${text}']`).scrollIntoViewIfNeeded();
        return this.page.locator(`//p[normalize-space(.)='${text}']`).isVisible();
    }
}
