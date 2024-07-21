import { Page, Response, TestInfo } from '@playwright/test';
import config from '../playwright.config';


interface CreateNewPage {
    page: Page;
    confluencePage?: {
        type: string;
        status: string;
        title: string;
        space: { key: string };
    };
}

const defaultHeaders = {
    Origin: config.use.baseURL,
    'X-Atlassian-Token': 'no-check',
    'Content-Type': 'application/json'
};

export const createPage = async ({
    page,
    confluencePage = {
        type: 'page',
        status: 'draft',
        title: `Playwright test ${new Date().getMilliseconds()}`,
        space: { key: process.env.SPACE_ID }
    }
}: CreateNewPage) => {
    const response = await page.request.post(
        `https://artem-posypailo.atlassian.net/wiki/rest/api/content?expand=space,metadata.frontend.collabService`,
        {
            headers: {
                ...defaultHeaders
            },
            data: confluencePage
        }
    );
    return (await response.json()).id;
};
