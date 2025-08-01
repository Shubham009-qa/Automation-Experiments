import {expect, test} from '@playwright/test'

test.beforeEach(async ({page}, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 20000)
})

test('auto waiting', async ({page}) => {
    const successButton = page.locator('.bg-success')

    //await successButton.click()

    //const text = await successButton.textContent()

    // await successButton.waitFor({state: 'attached'})
    // const text = await successButton.allTextContents()

    //expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test.skip('alternative waits', async ({page}) => {
    const successButton = page.locator('.bg-success')

    //wait for element
    // await page.waitForSelector('.bg-success')

    //wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for netwrok calls to be completed('not recommended)
    await page.waitForLoadState('networkidle')  

    // await page.waitForTimeout(5000)  //hard coded wait , not recommended

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')


})

test.skip('timeouts', async ({page}) => {
    //test.setTimeout(10000)   //set timeout for this test
    test.slow()   //3x of the default timeout
    const successButton = page.locator('.bg-success')
    await successButton.click()
})