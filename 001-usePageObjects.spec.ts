import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker' //import faker library to generate random data
// import {NavigationPage} from '../page-objects/naviagationPage'  //import file which we want to export
// import {FormLayoutPage} from '../page-objects/formLayoutPage' //import file which we want to export
// import {DatepickerPage} from '../page-objects/datePicker' //import file which we want to export

test.beforeEach( async ({page}) => {
    await page.goto('/')
})

test('Navigation to Form Layouts @smoke @regression', async ({page}) => {
    const pm = new PageManager(page) //create an instance of the page object class
    //const navigateTo = new NavigationPage(page) //create an instance of the page object class
    await pm.navigateTo().formlayoutPage() //call the method to navigate to form layouts page
    await pm.navigateTo().datePickerPage() //call the method to navigate to date picker page
    await pm.navigateTo().smartTablePage() //call the method to navigate to smart table page
    await pm.navigateTo().toasterPage() //call the method to navigate to toaster page
    await pm.navigateTo().tooltipsPage() //call the method to navigate to tooltips page
})



test('parameterized methoad @smoke', async ({page}) => {
    const pm = new PageManager(page)
    // const navigateTo = new NavigationPage(page)
    // const onFormLayoutPage = new FormLayoutPage(page)
    // const onDatePickerPage = new DatepickerPage(page) //create an instance of the page object class

    const randomFullName = faker.person.fullName() //generate random full name
    const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com` //generate random email

    await pm.navigateTo().formlayoutPage() //call the method to navigate to form layouts page
    await pm.onFormLayoutPage().submitUsingTheGridFormWithCredntialsAndSelectOption(process.env.USERNAME, process.env.Password, 'Option 1') //call the method to submit the form with credentials and select option
    // await page.screenshot({path: 'screenshots/formsLayoutsPage.png'}) //take a screenshot of the page
    // const buffer = await page.screenshot() //take a screenshot of the page
    // console.log(buffer.toString('base64')) //print the screenshot in base64 format
    await pm.onFormLayoutPage().submitInLineFormWIthNameEmailAndCheckbox(randomFullName, randomEmail, true) //call the method to submit the form with name, email and checkbox
    // await page.locator('nb-card').filter({has: page.getByText('Inline form')}).screenshot({path: 'screenshots/inlineForm.png'}) //take a screenshot of the inline form
    // await pm.navigateTo().datePickerPage() //call the method to navigate to date picker page
    // await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(20) //call the method to select date from today
    // await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(20, 30) //call the method to select date range from today
})

test.only('testing with argos CI', async ({page}) => {
    const pm = new PageManager(page) //create an instance of the page object class
    //const navigateTo = new NavigationPage(page) //create an instance of the page object class
    await pm.navigateTo().formlayoutPage() //call the method to navigate to form layouts page
    await pm.navigateTo().datePickerPage() //call the method to navigate to date picker page
})
