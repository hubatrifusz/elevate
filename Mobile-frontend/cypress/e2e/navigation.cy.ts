describe('Navigation test', () => {
  beforeEach(()=>{
    cy.login("verba@gmail.com", "Asdf1234567(");
  })
  it('should change the page to calendar and switch to tommorow', () => {
    cy.url().should('include', '/footertabs/feed');
    cy.get('[data-cy=calendar-tab]').click();
    cy.url().should('include', '/footertabs/calendar');
    cy.get('[data-cy=nextDay]').click();
  })
  it('should go to the menu, then friends page',()=>{
    cy.get('[data-cy=menuButton]').click();
    cy.get('[data-cy=FriendsPage]').click();
    cy.url().should('include', '/footertabs/friends');
  })
  it('should go to the menu, then profile page',()=>{
    cy.get('[data-cy=menuButton]').click();
    cy.get('[data-cy=profilePage]').click();
    cy.url().should('include', '/profile');
  })
})