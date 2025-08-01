import {test, expect} from '@playwright/test'
import { BoxChartComponent } from '@swimlane/ngx-charts'
import { tooltip } from 'leaflet'
import { delay } from 'rxjs-compat/operator/delay'

test.describe.configure({mode : 'parallel'}) //run all tests in this file in parallel

test.beforeEach( async ({page}) => {
    await page.goto('/')
})

test.describe('Form Layout page @block', () => {
    test.describe.configure({retries: 0}) //configure the retries for the tests in this describe block

    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    //Input Fields
    test('input fields', async ({page}, testinfo) => {
        if(testinfo.retry) {
            //do something
        }
        const usingTheGridEmailInput = page.locator('nb-card').filter({hasText: 'Using the grid'}).getByRole('textbox', {name: 'Email'})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com')
        //await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay :500})

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })



    //radio buttons
    test.only('radio buttons', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card').filter({hasText: 'Using the grid'})

        //await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})  // check used for select radio button and If radio button is hidden then use force: true
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()  //isChecked to check radio button is selected or not
        await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 250})
        // expect(radioStatus).toBeTruthy()
        // await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        // await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})
        // expect(await usingTheGridForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy()
    })
})


    //checkboxes
    test('checkboxes', async ({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})   //unCheck if checkbox is not selected then it didn't perform any action
        await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})  //Check if checkbox is not selected then it will select the checkbox

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()) {
            await box.uncheck({force: true})   //uncheck all boxes
            expect(await box.isChecked()).toBeFalsy()
        }
    })

    //Lists and dropdowns
    test('lists and dropdowns', async ({page}) => {
        const dropdownMenu = page.locator('ngx-header nb-select')
        await dropdownMenu.click()

        page.getByRole('list')  //when the list has a UL tag
        page.getByRole('listitem')  //when the list has a LI tag

        //const optionList = page.getByRole('list').locator('nb-option')
        const optionList = page.locator('nb-option-list  nb-option')
        await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
        await optionList.filter({hasText: 'Cosmic'}).click()  //click on the Cosmic option

        const header = page.locator('nb-layout-header')
        await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

        const colors = {
            'Light': 'rgb(255, 255, 255)',
            'Dark': 'rgb(34, 43, 69)',
            'Cosmic': 'rgb(50, 50, 89)',
            'Corporate': 'rgb(255, 255, 255)'

        }

        await dropdownMenu.click()
        for(const color in colors) {
            await optionList.filter({hasText: color}).click()
            await expect(header).toHaveCSS('background-color', colors[color])
            if(color !== 'Corporate') {
                await dropdownMenu.click()  //click on the dropdown menu to open it again
            
        }
    }
    })

    test('tooltips', async ({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()


        const toolTipCard = page.locator('nb-card').filter({hasText: 'Tooltip Placements'})
        await toolTipCard.getByRole('button', {name: 'TOP'}).hover()  //hover on the tooltip text to see the tooltip

        page.getByRole('tooltip')  //if you have a role tooltp created
        const toolTip = await page.locator('nb-tooltip').textContent()
        expect(toolTip).toEqual('This is a tooltip')

    })

    test('dialog box', async ({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()
        page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()  //accept the dialog box, mainly ussed for browser dialog box
        })
        await page.getByRole('table').locator('tr',{hasText:'mdo@gmail.com'}).locator('.nb-trash').click()
        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
    })
    test('web table', async ({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        //1 how to get any row by any test in this row
        const targetRow = page.getByRole('row', {name:'twitter@outlook.com'})
        await targetRow.locator('.nb-edit').click()  //click on the edit button of the row

        await page.locator('input-editor').getByPlaceholder('Age').clear()
        await page.locator('input-editor').getByPlaceholder('Age').fill('35')
        await page.locator('.nb-checkmark').click()  //click on the checkmark button to save the changes
        await expect(page.locator('table-cell-view-mode').filter({hasText: '35'})).toBeVisible()  //check if the changes are saved
    
        //2 get the row bases on the value in the specific column
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click()  //click on the second page of the table
        const targetRowID = page.getByRole('row',{name:'11'}).filter({has: page.locator('td').nth(1).getByText('11')})
        await targetRowID.locator('.nb-edit').click()  //click on the row with ID 11
        await page.locator('input-editor').getByPlaceholder('E-mail').clear()
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('.nb-checkmark').click() //click on the checkmark button to save the changes
        await expect(targetRowID.locator('td').nth(5)).toHaveText('test@test.com')

        //3 test filter of the table
        const ages = ["20","30","40","200"]

        for( let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)  //wait for the filter to be applied
        const ageRows = page.locator('tbody tr')

        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()

            if(age === '200'){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }else{
            expect(cellValue).toEqual(age)
            }
        }}
    })

test('date picker', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()  // Click on the input field to open the calendar

    let date = new Date();
    date.setDate(date.getDate() + 100);  // Set the date to 20 days from now but will if fail beacause date is from next month 
    const expectedDate = date.getDate().toString();
    const expectedMonthShot = date.toLocaleString('en-US', { month: 'short' })  // Get the short name of the month
    const expectedMonthLong = date.toLocaleString('en-US', { month: 'long' })  // Get the long name of the month
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`  // Format the date to be asserted

    let calenderMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()  // Get the required  month and year displayed in the calendar so that we can click on the next button to go to the next month
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`  // Format the month and year to be asserted

    // while loop for checking month until get expected month and year
    while(!calenderMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()  // Click on the next button to go to the next month
        calenderMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()  // Get the required month and year displayed in the calendar so that we can click on the next button to go to the next month
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)  // Assert the value in the input field

    // await page.locator('[class="day-cell ng-star-inserted"]').getByText('1',{exact:true}).click()  //click on the 1st day of the month
    // await expect(calenderInputField).toHaveValue('Apr 1, 2025')  //check if the date is selected

})

test ('slider', async ({page}) => {
    //update attribute to make slider visible
    // const tempgauge =  page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    // await tempgauge.evaluate(node => {
    //     node.setAttribute('cx', '232.630')
    //     node.setAttribute('cy', '232.630')
    // })  
    // await tempgauge.click()  //click on the slider to make it visible

    //mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()  //scroll the slider into view

    const box = await tempBox.boundingBox()  //get the bounding box of the slider
    const x = box.x + box.width / 2  //get the x coordinate of the slider
    const y = box.y + box.height / 2  //get the y coordinate of the slider
    await page.mouse.move(x, y)  //move the mouse to the center of the slider
    await page.mouse.down()  //click on the slider to make it visible
    await page.mouse.move(x + 100, y)  //move the mouse to the right of the slider
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()  //release the mouse button
    await expect(tempBox).toContainText('30')  //check if the slider is moved to the right

})



