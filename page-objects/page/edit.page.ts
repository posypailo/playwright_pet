import { Locator, Page } from 'playwright-core';
import { Link } from '../pageelement/link';
import { BasePage } from './base.page';

export enum PageElement {
    INSERT = 'Insert /',
    LINK = 'Link',
    TABLE = 'Table'
}

export enum PageAction {
    TOOLBAR_INSERT,
    QUICK_INSERT,
    TOOLBAR_BUTTON
}

export class Editor extends BasePage {

    protected rootSelector = '[data-testid=ak-editor-fp-content-area]';

    // protected table: Table;

    private inputSearchElementToInsert: Locator;

    public textareaPageTitle: Locator;

    private buttonPublish: Locator;

    private buttonUpdate: Locator;

    constructor(page: Page) {
        super(page);
        this.inputSearchElementToInsert = this.page.locator('[data-testid=element-browser] input');
        this.textareaPageTitle = this.page.locator('[data-test-id=editor-title]');
        this.buttonUpdate = this.page.locator('[data-testid="publish-modal-update-button"]');
        this.buttonPublish = this.page.locator('[data-testid="publish-button"]')
    }

    private getButtonOnToolbar(element: PageElement): Locator {
        return this.page.locator(`button[aria-label*="${element}"]`);
    }

    async publish() {

        const responsePromise = this.page.waitForResponse('**/rest/api/content/**', {
            timeout: 30000
        });
        await this.buttonPublish.click();
        const response = await (await responsePromise).json();
        return response.id
    }

    async update() {
        await this.buttonUpdate.click()
    }

    async add(element: PageElement, via: PageAction, inNewParagraph = true) {
        if (inNewParagraph) await this.putCursorAtTheEndOfPage();

        switch (via) {
            case PageAction.TOOLBAR_INSERT:
                await this.getButtonOnToolbar(PageElement.INSERT).click();
                await this.inputSearchElementToInsert.fill(element);
                await this.inputSearchElementToInsert.press('Enter');
                break;
            case PageAction.QUICK_INSERT:
                await this.page.keyboard.type(`/${element}`);
                await this.page.keyboard.press('Enter');
                break;
            case PageAction.TOOLBAR_BUTTON:
            default:
                await this.getButtonOnToolbar(element).click();
                break;
        }

        switch (element) {
            case PageElement.LINK:
                if (!this.$link) {
                    this.$link = new Link(this.page, this.rootSelector);
                }
                break;
            // case PageElement.TABLE:
            //   if (!this.table) this.table = new Table(this.page);
            //   break;
            default:
                break;
        }
    }

    async putCursorAtTheEndOfPage() {
        await this.page.locator(this.rootSelector).locator('//p').last().click();
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter'); // to put cursor at the and of page
    }

    // async moveCursorDown() {
    //   await this.page.locator('[class=ProseMirror-trailingBreak]').last().press('ArrowDown');
    //   await this.page.locator('[class=ProseMirror-trailingBreak]').last().press('Enter');
    // }
    async loseFocus() {
        await this.textareaPageTitle.click();
    }

    async paragraphExists(text: string): Promise<boolean> {
        return this.page.locator(`//p[normalize-space(.)='${text}']`).isVisible();
    }
}
