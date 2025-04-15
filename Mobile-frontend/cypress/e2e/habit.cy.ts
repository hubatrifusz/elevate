describe('Habit tests', () => {
  beforeEach(() => {
    cy.login("verba@gmail.com", "Asdf1234567(");
  })
  it('should create a new habit', () => {
    cy.get('[data-cy=fabButton]').click();
    cy.get('[data-cy=habitTitle]').type('Test Habit');
    cy.get('[data-cy=createHabit]').click();
    cy.url().should('include', '/footertabs/feed');
  })
  

})