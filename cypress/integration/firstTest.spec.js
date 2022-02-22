/// <reference types="cypress" />

// describe() is same as context()
describe("Our first test", () => {
  // will run before any test
  beforeEach("open application", () => {
    cy.visit("/");
  });

  it("first test", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // By Tag name
    cy.get("input");

    // By ID
    cy.get("#inputEmail");

    // By Class name
    cy.get(".input-full-width");

    // By Class value
    cy.get('[class="input-full-width size-medium shape-rectangle"]');

    // By Attribute name
    cy.get("[placeholder]");

    // By Attribute name and value
    cy.get('[placeholder="Email"]');

    // By Tag name and Attribute with value
    cy.get('input[placeholder="Email"]');

    // By 2 (or more) different Attributes
    cy.get('[placeholder="Email"][type="Email"]');

    // By Tag name, Attribute with value, ID and Class name
    cy.get('input[placeholder="Email"]#inputEmail.input-full-width');

    // THE RECOMMENDED WAY - creating our own attributes
    cy.get('[data-cy="imputEmail1"]');
  });

  // Check Form elements
  it("Form", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.get('[data-cy="signInButton"]');

    cy.contains('[status="warning"]', "Sign in");

    // Get the input by the inputEmail3 Id
    // Go up to the parent "form" Tag name
    // Find a button
    // TEST that this button contain the 'Sign in' text
    // Go up again to the "form" Tag name
    // Find the "checkbox" Tag name
    // Click on the checkbox
    cy.get("#inputEmail3")
      .parents("form")
      .find("button")
      .should("contain", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();

    // Search for nb-card that contains "Horizontal form" text -->
    // Find an element type=email
    cy.contains("nb-card", "Horizontal form").find('[type="email"]');
  });

  // Check Form elements
  it("Form", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // When using the 'then' here, we are moving from Cypress context to JQuery context
    cy.contains("nb-card", "Using the Grid").then((firstForm) => {
      const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text();
      const passLabelFirst = firstForm.find('[for="inputPassword2"]').text();

      expect(emailLabelFirst).to.equal("Email");
      expect(passLabelFirst).to.equal("Password");

      cy.contains("nb-card", "Basic form").then((secondForm) => {
        const passLabelSecond = secondForm
          .find('[for="exampleInputPassword1"]')
          .text();

        expect(passLabelFirst).to.equal(passLabelSecond);

        // When using the 'wrap' here, we are moving back from JQuery context to Cypress context
        cy.wrap(secondForm)
          .find('[for="exampleInputPassword1"]')
          .should("contain", "Password");
      });
    });
  });

  it("Invoke Commands", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.get('[for="exampleInputEmail1"]')
      // Chai assertions = should(..., ...)
      .should("contain", "Email address")
      .should("have.class", "label")
      .and("have.text", "Email address");

    // Same as before just that we use Chai JQuery Assertions
    cy.get('[for="exampleInputEmail1"]').then((label) => {
      // Chai JQuery assertions - expect($el)...
      expect(label.text()).to.equal("Email address");
      expect(label).to.have.class("label");
      expect(label).to.have.text("Email address");
    });

    // Same as before just that we invoke the "text()" method before the "then"
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Email address");
      });

    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .invoke("attr", "class")
      .then((classVal) => {
        // Chai JQuery assertions - expect($el)...
        expect(classVal).to.contain("checked");
      });
  });

  // Using invoke method to get Input Properties check
  // Check Datepicker
  it("Date Picker", () => {
    const selectDayFromCurrent = (addDays) => {
      let date = new Date();
      date.setDate(date.getDate() + addDays);
      let futureDay = date.getDate();
      let futureMonth = date.toLocaleString("default", { month: "short" });
      let dateAssert =
        futureMonth + " " + futureDay + ", " + date.getFullYear();

      cy.get("nb-calendar-navigation")
        .invoke("attr", "ng-reflect-date")
        .then((dateAttribute) => {
          // We need to check if after adding 5 days we moved to next month
          if (!dateAttribute.includes(futureMonth)) {
            cy.get('[data-name="chevron-right"]').click();
            selectDayFromCurrent(addDays);
          } else {
            cy.get("nb-calendar-day-picker [class='day-cell ng-star-inserted']")
              .contains(futureDay)
              .click();
          }
        });

      return dateAssert;
    };

    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        let dateAssert = selectDayFromCurrent(45);

        // We do not have the value property in the DOM,
        // we just have it as part of the Input Properties
        // so we are using Invoke
        cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
        cy.wrap(input).should("have.value", dateAssert); // Same but different syntax
      });
  });

  // Checks Radio Buttons
  it("Radio Buttons", () => {
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radioButton) => {
        // force: true = is forcing Cypress to search for Hidden elements
        cy.wrap(radioButton)
          .first()
          .check({ force: true })
          .should("be.checked");

        cy.wrap(radioButton).eq(1).check({ force: true });

        cy.wrap(radioButton).first().should("not.be.checked");
      });
  });

  // Check Checkbox Buttons
  it("Check Boxes", () => {
    cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").click();

    cy.get('[type="checkbox"]')
      .eq(0)
      .check({ force: true })
      .should("be.checked");

    cy.get('[type="checkbox"]')
      .eq(2)
      .uncheck({ force: true })
      .should("not.be.checked");
  });

  // Check List and dropdown
  it("List and Dropdown", () => {
    // Check 1 value
    cy.get("nav nb-select").click();
    cy.get(".options-list").contains("Dark").click();
    cy.get("nav nb-select").should("contain", "Dark");
    cy.get("nb-layout-header nav").should(
      "have.css",
      "background-color",
      "rgb(34, 43, 69)"
    );

    // Check by LOOP
    cy.get("nav nb-select").then((dropdown) => {
      cy.wrap(dropdown).click();

      // If our select was not nb-select but "<select>" we could use cy.get("select").select("...")...
      cy.get(".options-list nb-option").each((listItem, index) => {
        const itemText = listItem.text().trim();

        const colors = {
          Light: "rgb(255, 255, 255)",
          Dark: "rgb(34, 43, 69)",
          Cosmic: "rgb(50, 50, 89)",
          Corporate: "rgb(255, 255, 255)",
        };

        cy.wrap(listItem).click();
        cy.wrap(dropdown).should("contain", itemText);
        cy.get("nb-layout-header nav").should(
          "have.css",
          "background-color",
          colors[itemText]
        );
        if (index < 3) {
          cy.wrap(dropdown).click();
        }
      });
    });
  });

  // Check Web Tables
  it("Web Tables", () => {
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    // Update a row
    cy.get("table tbody")
      .contains("tr", "Larry")
      .then((tableRow) => {
        cy.wrap(tableRow).find(".nb-edit").click();
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("25");
        cy.wrap(tableRow).find(".nb-checkmark").click();
        cy.wrap(tableRow).find("td").eq(6).should("contain", "25");
      });

    // Add new row
    cy.get("table thead").find(".nb-plus").click();

    cy.get("table thead")
      .find("tr")
      .eq(2)
      .then((headerRow) => {
        // Add values
        cy.wrap(headerRow).find("td").eq(1).find("input").type("11");
        cy.wrap(headerRow).find("td").eq(2).find("input").type("Shahar");
        cy.wrap(headerRow).find("td").eq(3).find("input").type("Shilman");
        cy.wrap(headerRow).find("td").eq(4).find("input").type("shaharsn");
        cy.wrap(headerRow).find("td").eq(5).find("input").type("test@test.com");
        cy.wrap(headerRow).find("td").eq(6).find("input").type("32");
        // Add the new row
        cy.wrap(headerRow)
          .find("td")
          .eq(0)
          .find(".ng2-smart-action-add-create")
          .click();
      });

    cy.get("table tbody")
      .first()
      .then((tableRow) => {
        cy.wrap(tableRow).find("td").eq(2).should("contain", "Shahar");
        cy.wrap(tableRow).find("td").eq(3).should("contain", "Shilman");
        cy.wrap(tableRow).find("td").eq(4).should("contain", "shaharsn");
      });

    // filter the table results
    const ages = [20, 30, 40, 200];

    cy.wrap(ages).each((age) => {
      cy.get('table thead [placeholder="Age"]').clear().type(age);
      cy.wait(500);
      cy.get("tbody tr").each((tableRow) => {
        if (age == 200) {
          cy.wrap(tableRow).should("contain", "No data found");
        } else {
          cy.wrap(tableRow).find("td").eq(6).should("contain", age);
        }
      });
    });
  });

  // Check tooltip
  it("Tooltip", () => {
    cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").click();

    cy.contains("nb-card", "Colored Tooltips").contains("Default").click();
    cy.get("nb-tooltip").should("contain", "This is a tooltip");
  });

  // Check Dialog box
  it("Dialog box", () => {
    cy.contains("Tables & Data").click();
    cy.contains("Smart Table").click();

    const stub = cy.stub();
    cy.on("window:confirm", stub);
    cy.get("tbody tr")
      .first()
      .find(".nb-trash")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "Are you sure you want to delete?"
        );
      });
  });
});
