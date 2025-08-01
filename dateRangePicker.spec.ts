import { test, expect } from '@playwright/test';
import { DateRangePicker } from '../page-objects/dateRangePicker';

test.describe('Dynamic Date Range Picker Tests', () => {
  let dateRangePicker: DateRangePicker;

  test.beforeEach(async ({ page }) => {
    dateRangePicker = new DateRangePicker(page);
    await page.goto('/');
  });

  test('Select date range 5 to 10 days from today', async ({ page }) => {
    await dateRangePicker.selectDateRangeFromToday(5, 10);

    // Verify the selected range (assuming the range is displayed somewhere on the page)
    const selectedRange = await page.locator('.selected-range').textContent();
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 5);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 10);

    const expectedRange = `${startDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })} - ${endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`;

    expect(selectedRange).toContain(expectedRange);
  });
});