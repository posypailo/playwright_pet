import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config({ override: true});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: './tests',
    /* Maximum time one test can run for. */
    timeout: 10 * 60 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000
    },

    /* Run tests in files in parallel */
    //  fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters
     Concise 'undefined' for CI, default 'html' when running locally*/
    reporter: process.env.CI
        ? []
        : [['html', { open: 'never' }], ['list']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit)*/
        actionTimeout: 20000,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure',
        /*Set width and height for screen*/
        viewport: { width: 1920, height: 1080 },
        screenshot: 'only-on-failure',
        video: 'on',
        /*Whether to ignore HTTPS errors when sending network requests. Defaults to false.*/
        ignoreHTTPSErrors: true,
        headless: true,
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'setup',
            use: {
                headless: true,
                 /* Base URL to use in actions like `await page.goto('/')`. */
                 baseURL: 'https://id.atlassian.com',

            },
            testMatch: 'auth.test.ts'
        },
        {
            name: 'Chrome',
            dependencies: ['setup'],
            use: {
                baseURL: 'https://artem-posypailo.atlassian.net',
                storageState: './auth/defaultStorageState.json',
                channel: 'chrome'
            }
        },
        {
            name: 'Edge',
            dependencies: ['setup'],
            use: {
                baseURL: 'https://artem-posypailo.atlassian.net',
                storageState: './auth/defaultStorageState.json',
                channel: 'msedge'
            }
        }
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: 'test-results/'
};

export default config;
