import { onFormLayoutSubmit } from "../support/pageObjects/formLayoutPage";
import { onDatepickerPage } from "../support/pageObjects/datepickerPage";
import { onSmartTablePage } from "../support/pageObjects/smartTablePage";
import { navigateTo } from "../support/pageObjects/navigationPage";

describe("Test with page objects", () => {
  beforeEach("open application", () => {
    cy.openHomePage(); // using the Commands file
  });

  // Testing navigation
  it("verify navigation across the page", () => {
    navigateTo.formLayoutPage();
    navigateTo.datepickerPage();
    navigateTo.smartTablePage();
    navigateTo.tooltipPage();
    navigateTo.toasterPage();
  });

  // Testing the page objects functionality
  it("should submit Inline and Basic form and select tomorrow date in the calendar", () => {
    navigateTo.formLayoutPage();
    onFormLayoutSubmit.submitInlineFormWithNameAndEmail(
      "Shahar",
      "test@test.com"
    );
    onFormLayoutSubmit.submitBasicFormWiteEmailAndPassword(
      "test@test.com",
      "password"
    );

    navigateTo.datepickerPage();
    onDatepickerPage.selectCommonDatepickerDateFromToday(1);
    onDatepickerPage.selectDatepickerWithRangeFromToday(7, 14);

    navigateTo.smartTablePage();
    onSmartTablePage.addNewRecordWithFirstAndLastName("Shahar", "Shilman");
    onSmartTablePage.updateAgeByFirstName("Shahar", "33");
    onSmartTablePage.deleteRowByIndex(1);
  });
});
