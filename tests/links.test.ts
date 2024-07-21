import { expect, test } from '../fixtures/new.page';
import { PageAction, PageElement } from '../page-objects/page/edit.page.js';
// import { createPage } from '../api/page.js';

test.describe('Links', () => {
    test('Create publish @link @smoke', async ({ page, editor, viewer }) => {
        await test.step('1. Create a new link via Toolbar Button Link', async () => {
            await editor.add(PageElement.LINK, PageAction.TOOLBAR_BUTTON);
            await editor.link.setURL(testData.BASEURL_SPACES);
            await expect(await editor.link.getUrlLinkTitle(testData.BASEURL_SPACES)).toEqual(testData.BASEURL_SPACES);
        });


        await test.step('2. Publish page', async () => {
            await editor.update();

            await viewer.page.waitForLoadState('load');
            await expect(await viewer.paragraphExists(testData.BASEURL_SPACES)).toBe(true);
            await viewer.link.clickOn(testData.BASEURL_SPACES);
            await expect(viewer.page.url()).toEqual(testData.BASEURL_SPACES);
            await viewer.page.goBack();
        });
    });
});

const testData = {
    BASEURL_SPACES: 'https://artem-posypailo.atlassian.net/wiki/spaces/',
    NEW_TITlE: 'Atlassian home'
};
