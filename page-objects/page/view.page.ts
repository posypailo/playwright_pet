import { Locator, Page } from 'playwright';
import { BasePage } from './base.page';

export class Viewer extends BasePage {
    protected rootSelector = '[data-test-id=confluence-main-content]';
    private buttonEdit: Locator;
    public textareaPageTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.buttonEdit = page.locator("[data-test-id='fabric-edit-button']");
        this.textareaPageTitle = page.locator('[data-testid="title-text"]');
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
