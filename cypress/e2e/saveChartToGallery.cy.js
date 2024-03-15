describe('Saving a chart to the "galler"', () => {
  it('generate and save chart, navigate to gallery', () => {
    cy.visit('/')
    cy.contains("Line").click()
    cy.fillData1()
    cy.contains("Generate chart").click()
    cy.contains("Save chart").click()
    cy.contains("Gallery").click()
    cy.get(".chart-title").should("contain", "My Title")
  })
})