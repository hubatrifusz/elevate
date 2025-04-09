describe('Habit tests', () => {
  before(() => {
    cy.login("verba@gmail.com", "Asdf1234567(");
  })
  it('should create a new habit', () => {
    cy.get('[data-cy=fabButton]').click();
    cy.get('date-cy=habitTitle').type('Test Habit');
    cy.get('[data-cy=createHabit]').click();
    cy.url().should('include', '/footertabs/feed');
  })
})