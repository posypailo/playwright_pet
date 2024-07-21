import { test as base, expect } from '@playwright/test';
import { Editor } from '../page-objects/page/edit.page';
import { Viewer } from '../page-objects/page/view.page';
import config from '../playwright.config';

export type NewPage = {
    editor: Editor;
    viewer: Viewer;
};

export const test = base.extend<NewPage>({
    page: async ({ page }, use) => {
        const editor = new Editor(page);
        const viewer = new Viewer(page);

        await page.goto(`/wiki/spaces/~${process.env.SPACE_ID}/overview`)
        await page.locator('[data-testid="contextual-create-content-button"]').click();
        await page.locator('[href$="Create-page"]').click();
        await editor.textareaPageTitle.click();
        await editor.textareaPageTitle.clear();

        const randomNumber = Math.random();
        const pageTitle = `Page ${randomNumber}`
        await editor.textareaPageTitle.fill(pageTitle);
        const pageId = await editor.publish();
        await page.locator('#publish-button').click();
        await expect(viewer.textareaPageTitle).toHaveText(pageTitle);

        await page.goto(`/wiki/spaces/~${process.env.SPACE_ID}/pages/edit-v2/${pageId}`)

        await use(page);
    },
    editor: async({ page }, use) => {
        const editor = new Editor(page);
        await use(editor)
    },
    viewer: async({ page }, use) => {
        const viewer = new Viewer(page);
        await use(viewer);
    }
});

export { expect } from '@playwright/test';
