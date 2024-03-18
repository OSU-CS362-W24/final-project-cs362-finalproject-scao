describe('Chart is correctly Generated', () => {
  it('Supplies needed data and clicks generate', () => {
    cy.visit('/')
    cy.contains("Line").click()
    cy.fillData1()
    cy.contains("Generate chart").click()
    cy.get("#chart-img").should("exist")
  })
})