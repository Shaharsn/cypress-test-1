const selectDayFromCurrent = (addDays) => {
  let date = new Date();
  date.setDate(date.getDate() + addDays);
  let futureDay = date.getDate();
  let futureMonth = date.toLocaleString("default", { month: "short" });
  let dateAssert = futureMonth + " " + futureDay + ", " + date.getFullYear();

  cy.get("nb-calendar-navigation")
    .invoke("attr", "ng-reflect-date")
    .then((dateAttribute) => {
      // We need to check if after adding 5 days we moved to next month
      if (!dateAttribute.includes(futureMonth)) {
        cy.get('[data-name="chevron-right"]').click();
        selectDayFromCurrent(addDays);
      } else {
        cy.get(".day-cell").not(".bounding-month").contains(futureDay).click();
      }
    });

  return dateAssert;
};

export class DatepickerPage {
  selectCommonDatepickerDateFromToday(dayFromToday: number) {
    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        let dateAssert = selectDayFromCurrent(dayFromToday);

        // We do not have the value property in the DOM,
        // we just have it as part of the Input Properties
        // so we are using Invoke
        cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
        cy.wrap(input).should("have.value", dateAssert); // Same but different syntax
      });
  }

  selectDatepickerWithRangeFromToday(firstDay: number, secondDay: number) {
    cy.contains("nb-card", "Datepicker With Range")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        let dateAssertFirst = selectDayFromCurrent(firstDay);
        let dateAssertSecond = selectDayFromCurrent(secondDay);

        const finalDate = dateAssertFirst + " - " + dateAssertSecond;

        // We do not have the value property in the DOM,
        // we just have it as part of the Input Properties
        // so we are using Invoke
        cy.wrap(input).invoke("prop", "value").should("contain", finalDate);
        cy.wrap(input).should("have.value", finalDate); // Same but different syntax
      });
  }
}

export const onDatepickerPage = new DatepickerPage();
