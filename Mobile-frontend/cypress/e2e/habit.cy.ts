describe('Habit tests', () => {
  before(() => {
    cy.login("verba@gmail.com", "Asdf1234567(");
  })
  it('should create a new habit', () => {
    cy.get('[data-cy=fabButton]').click();
    cy.get('[data-cy=habitTitle]').type('Test Habit');
    cy.get('[data-cy=createHabit]').click();
    cy.url().should('include', '/footertabs/feed');
  })
  it('should check the habit', () => {
    cy.get('[data-cy=calendar-tab]').click();
    cy.url().should('include', '/footertabs/calendar');
    cy.get('ion-content:visible').should('exist');
    cy.get('ion-content:visible [data-cy=habitCard]')
      .first()
      .should('be.visible')
      .click();
    cy.get('ion-content:visible [data-cy=checkHabit]')
      .first()
      .should('be.visible')
      .click();
    cy.get('.alert-button-role-confirm > .alert-button-inner').click()

  });

})