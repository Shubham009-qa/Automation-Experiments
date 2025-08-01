import { expect } from '@playwright/test'
import { test } from '../test-options'

test('drag and drop', async ({page, globalQaURL}) => {
    await page.goto(globalQaURL)
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')  //get the frame locator of the drag and drop demo site 
    await frame.locator('Li',{hasText:'High Tatras 2'}).dragTo(frame.locator('#trash')) //drag the image to the trash icon

    //more precise control
    await frame.locator('Li',{hasText:'High Tatras 4'}).hover() //hover the image to be dragged
    await page.mouse.down() //press the mouse down
    await frame.locator('#trash').hover() //hover the trash icon
    await page.mouse.up() //release the mouse button

    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4']) //assert the image is in the trash icon

})