import {test } from '../test-options' //import the test from test-options.ts
import {faker} from '@faker-js/faker' //import faker library to generate random data
// import {NavigationPage} from '../page-objects/naviagationPage'  //import file which we want to export
// import {FormLayoutPage} from '../page-objects/formLayoutPage' //import file which we want to export
// import {DatepickerPage} from '../page-objects/datePicker' //import file which we want to export

// test.beforeEach( async ({page}) => {
//     await page.goto('/')
// })

test('parameterized methoad', async ({pageManager }) => {
    const randomFullName = faker.person.fullName() //generate random full name
    const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com` //generate random email

    // await pm.navigateTo().formlayoutPage() //call the method to navigate to form layouts page
    await pageManager.onFormLayoutPage().submitUsingTheGridFormWithCredntialsAndSelectOption(process.env.USERNAME, process.env.Password, 'Option 1') //call the method to submit the form with credentials and select option
    await pageManager.onFormLayoutPage().submitInLineFormWIthNameEmailAndCheckbox(randomFullName, randomEmail, true) //call the method to submit the form with name, email and checkbox
    
})