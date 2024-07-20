import type { Page } from 'playwright';

export class Clipboard {
    page: Page;

    constructor({ page }: { page: Page }) {
        this.page = page;
    }
}
