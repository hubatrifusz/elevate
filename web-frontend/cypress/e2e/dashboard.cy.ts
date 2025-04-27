// cypress/e2e/task-view.cy.ts

describe('Task View Page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:4200/dashboard');
  });

  it("should display today's date correctly", () => {
    const today = new Date();
    const weekday = today.toLocaleDateString('en-US', { weekday: 'short' });
    const dayAndMonth = today.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

    cy.get('#date_container').within(() => {
      cy.contains(weekday);
      cy.contains(dayAndMonth);
    });
  });

  it('should open and close the add new task form', () => {
    cy.get('#add_new_task_button').click();
    cy.get('form').should('exist');

    cy.get('form img[alt="cross"]').click();
    cy.get('form').should('not.exist');
  });

  it("should disable previous button if on today's date", () => {
    cy.get('#date_container img[alt="Previous Day"]').should('have.css', 'pointer-events', 'none').and('have.css', 'opacity', '0.5');
  });

  it('should display "No tasks for today!" when there are no habits', () => {
    cy.intercept('GET', `**/habitlog/**`, {
      statusCode: 404,
      body: [],
    }).as('getTodaysHabitlogs');

    cy.visit('http://localhost:4200/dashboard');

    cy.wait('@getTodaysHabitlogs');

    cy.contains('No tasks for today!').should('exist');
    cy.contains("Click 'Add' to create a new habit.").should('exist');
  });

  it('should create a positive habit', () => {
    cy.get('#add_new_task_button').click();

    cy.get('#title_text_input').type('Read a book');
    cy.get('#description_text_input').type('Read for 30 minutes');
    cy.get('#color_picker_input').invoke('val', '#ff5733').trigger('input');
    cy.get('#frequency_selector').select('Daily');

    cy.get('form button').contains('Add new positive habit').click();
  });
});
