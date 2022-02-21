export class SmartTablePage {
  addNewRecordWithFirstAndLastName(firstName: string, lastName: string) {
    // Add new row
    cy.get("table thead").find(".nb-plus").click();

    cy.get("table thead")
      .find("tr")
      .eq(2)
      .then((headerRow) => {
        // Add values
        cy.wrap(headerRow).find('[placeholder="First Name"]').type(firstName);
        cy.wrap(headerRow).find('[placeholder="Last Name"]').type(lastName);
        cy.wrap(headerRow).find(".nb-checkmark").click();

        cy.get("table tbody tr")
          .first()
          .find("td")
          .then((tableColumn) => {
            cy.wrap(tableColumn).eq(2).should("contain", firstName);
            cy.wrap(tableColumn).eq(3).should("contain", lastName);
          });
      });
  }

  updateAgeByFirstName(name: string, age: string) {
    // Update a row
    cy.get("table tbody")
      .contains("tr", name)
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type(age);
        cy.wrap(tableRow).find(".nb-checkmark").click();
        cy.wrap(tableRow).find("td").eq(6).should("contain", age);
      });
  }

  deleteRowByIndex(index: number) {
    const stub = cy.stub();
    cy.on("window:confirm", stub);
    cy.get("tbody tr")
      .eq(index)
      .find(".nb-trash")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "Are you sure you want to delete?"
        );
      });
  }
}

export const onSmartTablePage = new SmartTablePage();
