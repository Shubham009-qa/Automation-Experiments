import {expect, test} from '@playwright/test'

test.beforeEach('sign up', async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

// test('signup user facing locators', async ({page}) => {
//     await page.getByRole('textbox', {name:"First name"}).first().click()
//     await page.getByPlaceholder('Last').first().click()
//     await page.getByLabel('Practice / Company name ').first().click()
//     await page.getByText('Phone number').first().click()
//     //await page.getByTestId('SignIn').first().click()    //data-testid='SignIn' in inspect
//     //await page.getByTitle('AutoEntry').first().click()
// })

test('Signup locating child elements', async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name:"Sign in"}).first().click()
    await page.locator('nb-card').nth(1).getByRole('button').click()

})

test('locating parent elements', async ({page}) => {
    //use for aany particular grid/box from where you want to use fields
    await page.locator('nb-card', {hasText: "Using the grid"}).getByRole ('textbox',{name:"Email"}).click()   
    await page.locator('nb-card', {has:page.locator('#inputEmail1')}).getByRole ('textbox',{name:"Email"}).click() 

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole ('textbox',{name:"Email"}).click()
    await page.locator('nb-card').filter({has:page.locator('.status-danger')}).getByRole ('textbox',{name:"Password"}).click()

    await page.locator('nb-card').filter({has:page.locator('nb-checkbox')}).filter({hasText: "Sign In"})
    .getByRole ('textbox',{name:"Password"}).click()
})


test('reusing the locators', async ({page}) => {
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole ('textbox',{name:"Email"}).fill('test@test.com')
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole ('textbox',{name:"Password"}).fill('Welcome123')
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole ('button').click()

})

test('reusing the locatorsminimise', async ({page}) => {
    const basicform = page.locator('nb-card').filter({hasText: "Basic form"})

    await basicform.getByRole ('textbox',{name:"Email"}).fill('test@test.com')
    await basicform.getByRole ('textbox',{name:"Password"}).fill('Welcome123')
    await basicform.getByRole ('button').click()

})

test('reusing the locatorsminimise V2', async ({page}) => {
    const basicform = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicform.getByRole ('textbox',{name:"Email"})

    await emailField.fill('test@test.com')
    await basicform.getByRole ('textbox',{name:"Password"}).fill('Welcome123')
    await basicform.locator('nb-checkbox').click()
    await basicform.getByRole ('button').click()

    await expect(emailField).toHaveValue('test@test.com')

})

test ('extracting values', async ({page}) => {

    //single test value
    const basicform = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicform.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all test values
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    expect (allRadioButtonLabels).toContain("Option 1")
    
    //input value
    const emailField = basicform.getByRole ('textbox',{name:"Email"})
    await emailField.fill('test@test.com')
    const emailvalue = await emailField.inputValue()
    expect(emailvalue).toEqual('test@test.com')

    const placeholdervalue = await emailField.getAttribute('placeholder')
    expect(placeholdervalue).toEqual('Email')   

})

test('assertions', async ({page}) => {
    const basicformButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    //General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicformButton.textContent()
    expect(text).toEqual('Submit')

    //Locator assertion
    await expect(basicformButton).toHaveText('Submit')

    //soft assertion  used for even if assertion failed it will perform next steps
    await expect.soft(basicformButton).toHaveText('Submit5')
    await basicformButton.click()
})








