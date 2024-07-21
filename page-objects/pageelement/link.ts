import type { Locator, Page } from 'playwright';

export enum FloatingToolbar {
    URL = 'URL',
    INLINE = 'Inline',
    CARD = 'Card',
    EMBED = 'Embed',
    EDIT_LINK = 'Edit link',
    OPEN_IN_NEW_TAB = 'Open link in a new tab',
    UNLINK = 'Unlink',
    COPY = 'Copy',
    REMOVE = 'Remove'
}

export class Link {
    page: Page;
    private root: Locator;
    private floatingToolbar: Locator;
    private inputLinkUrl: Locator;
    private inputLinkLabel: Locator;
    private buttonInsert: Locator;

    constructor(page: Page, rootSelector: string = '') {
        this.page = page;
        this.root = this.page.locator(rootSelector); //to differ element for Viewer and Editor pages
        this.floatingToolbar = this.page.locator('[aria-label="Floating Toolbar"]');
        this.inputLinkUrl = this.page.locator('input[data-testid="link-url"]');
        this.inputLinkLabel = this.page.locator('input[data-testid="link-label"]');
        this.buttonInsert = this.page.locator('[data-testid="link-picker-insert-button"]');
    }

    async setURL(url: string, title?: string) {
        await this.inputLinkUrl.clear();
        await this.inputLinkUrl.fill(url);
        if (title) {
            await this.inputLinkLabel.clear();
            await this.inputLinkLabel.fill(title);
        }
        // await this.page.keyboard.press('Enter');
        await this.buttonInsert.click()
    }

    //can be used for indirect verification of a link title
    async clickOn(text: string) {
        //TODO refactor to use for Embed or create methods to work with Embedded
        await this.page.waitForTimeout(1000);
        if (text.startsWith('http')) {
            await this.root.locator(`[href='${text}']`).first().click();
        } else {
            await this.root.locator(`//a[normalize-space(.)='${text}']`).first().click();
        }
    }

    // async clickLabelOnToolbar(name: FloatingToolbar) {
    //     await this.floatingToolbar.locator(`[aria-label^="${name}"]`).first().click();
    // }

    // async labelOnToolbarExists(name: FloatingToolbar): Promise<boolean> {
    //     return this.floatingToolbar.locator(`[aria-label^="${name}"]`).isVisible();
    // }

    async getUrlLinkTitle(hrefText: string): Promise<any> {
        return this.root.locator(`p>a[href='${hrefText}']`).textContent();
    }

    // async urlLinkTitleExists(hrefText: string): Promise<boolean> {
    //     return this.root.locator(`p>a[href='${hrefText}']`).isVisible();
    // }

    // async getInlineLinkTitle(hrefText: string): Promise<any> {
    //     return this.root.locator(`[href^='${hrefText}'] [class^='smart-link-title']`).textContent();
    // }

    // async inlineLinkTitleExists(hrefText: string): Promise<boolean> {
    //     return this.root.locator(`[href^='${hrefText}'] [class^='smart-link-title']`).isVisible();
    // }

    // async getCardLinkTitle(hrefText: string): Promise<any> {
    //     return this.root.locator(`a[data-smart-element='Title'][href='${hrefText}']`).textContent();
    // }

    // async cardLinkTitleExists(hrefText: string): Promise<boolean> {
    //     return this.root.locator(`a[data-smart-element='Title'][href='${hrefText}']`).isVisible();
    // }
}
