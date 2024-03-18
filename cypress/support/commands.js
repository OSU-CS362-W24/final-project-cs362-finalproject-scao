// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
require("@testing-library/cypress/add-commands")

Cypress.Commands.add("fillData1", function () {
    cy.findByLabelText("Chart title").type("My Title")
    cy.findByLabelText("X label").type("My X Label")
    cy.findByLabelText("Y label").type("My Y Label")
    cy.get("#add-values-btn").click()
    cy.get("#add-values-btn").click()
    cy.get(":nth-child(4) > .x-value-input").type("1")
    cy.get(":nth-child(6) > .x-value-input").type("2")
    cy.get(":nth-child(8) > .x-value-input").type("3")
    cy.get(":nth-child(5) > .y-value-input").type("2")
    cy.get(":nth-child(7) > .y-value-input").type("4")
    cy.get(":nth-child(9) > .y-value-input").type("8")
    })