import { Locator, Page } from 'playwright-core';
import { Link } from '../../pageelement/link';

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

export class Editor {
    public readonly page: Page;

    private readonly rootSelector = '[data-testid=ak-editor-fp-content-area]';

    private $link!: Link;

    // protected table: Table;

    private inputSearchElementToInsert: Locator;

    private textareaPageTitle: Locator;

    private buttonPublish: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputSearchElementToInsert = this.page.locator('[data-testid=element-browser] input');
        this.textareaPageTitle = this.page.locator('[data-test-id=editor-title]');
        this.buttonPublish = this.page.locator('[id=publish-button]');
    }

    public get link(): Link {
        if (!this.$link) {
            this.$link = new Link(this.page, this.rootSelector);
        }
        return this.$link;
    }

    private getButtonOnToolbar(element: PageElement): Locator {
        return this.page.locator(`button[aria-label*="${element}"]`);
    }

    async publish() {
        await this.buttonPublish.click();
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
