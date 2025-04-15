describe('Friends Page', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', /friendship\/.*\/friends/, {
      statusCode: 200,
      body: [],
    }).as('getEmptyFriends');

    const friends = [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Anderson',
        email: 'alice@example.com',
        profilePictureBase64: null,
      },
    ];

    cy.intercept('GET', /friendship\/.*\/friends/, {
      statusCode: 200,
      body: friends,
    }).as('getFriends');

    cy.visit('http://localhost:4200/friends');
  });

  it('should display loading spinner when friends are being loaded', () => {
    // Intercept the GET friends call and simulate a delay
    cy.intercept('GET', '/api/friends', (req) => {
      req.reply((res) => {
        res.delay = 500;
      });
    }).as('getFriendsLoading');

    // When the friends loading flag is true, the spinner should be visible.
    cy.get('.loading-container').should('be.visible');
  });

  it('should show message when there are no friends', () => {
    cy.wait('@getEmptyFriends');
    cy.contains("You don't have any friends. :(").should('be.visible');
  });

  it('should display friends list when friends are returned', () => {
    cy.wait('@getFriends');

    cy.contains('Alice Anderson').should('be.visible');
    cy.contains('alice@example.com').should('be.visible');
  });

  it('should delete a friend successfully', () => {
    // Prepare a single friend in the list
    const friends = [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', profilePictureBase64: null }];

    cy.intercept('GET', '/api/friends', {
      statusCode: 200,
      body: friends,
    }).as('getFriends');

    // Intercept the DELETE friend API call
    cy.intercept('DELETE', '/api/friend/1', {
      statusCode: 200,
      body: { message: 'Friend deleted' },
    }).as('deleteFriend');

    cy.reload();
    cy.wait('@getFriends');

    // Click on the action button (menu dots) to reveal the options
    cy.get('.friend')
      .first()
      .within(() => {
        cy.get('.action_button').click();
      });

    // Click the delete button in the options container
    cy.get('#options button').click();
    cy.wait('@deleteFriend');

    // After deletion the friend should no longer be displayed.
    cy.get('.friend').should('not.exist');
  });

  it('should search for a friend and display search results', () => {
    const searchResults = [{ id: '3', firstName: 'Alice', lastName: 'Wonderland', email: 'alice@example.com' }];

    // Intercept the GET request triggered by the searchUsers() function.
    // Adjust the URL with a wildcard if necessary.
    cy.intercept('GET', '/api/users?*', {
      statusCode: 200,
      body: searchResults,
    }).as('searchUsers');

    // Enter an email in the search input and simulate pressing Enter.
    cy.get('[data-cy="search_friend_search_input"]').type('alice@example.com{enter}');
    cy.wait('@searchUsers');

    // Validate that the search result container shows the expected result.
    cy.get('#search_result_container').contains('alice@example.com').should('be.visible');
  });

  it('should send a friend request from the search result', () => {
    const searchResults = [{ id: '3', firstName: 'Alice', lastName: 'Wonderland', email: 'alice@example.com' }];

    cy.intercept('GET', '/api/users?*', {
      statusCode: 200,
      body: searchResults,
    }).as('searchUsers');

    cy.get('[data-cy="search_friend_search_input"]').type('alice@example.com{enter}');
    cy.wait('@searchUsers');

    // Intercept the friend request POST call
    cy.intercept('POST', '/api/friendship', {
      statusCode: 200,
      body: { message: 'Friend request sent' },
    }).as('sendFriendRequest');

    // Click the "follow" icon inside the search result to send a friend request.
    cy.get('#search_result_container').within(() => {
      // Assumes the image for sending a friend request has class "ui_image"
      cy.get('img.ui_image').click();
    });
    cy.wait('@sendFriendRequest');

    // Check that the button image is updated to indicate the request was sent
    cy.get('#search_result_container').within(() => {
      cy.get('img.ui_image').should('have.attr', 'src', 'icons/check.png');
    });
  });

  it('should display friend requests', () => {
    const friendRequests = [{ id: '4', firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com' }];

    // Intercept the friend requests API call (adjust the endpoint if needed)
    cy.intercept('GET', '/api/friendRequests', {
      statusCode: 200,
      body: friendRequests,
    }).as('getFriendRequests');

    // Reload the page to load friend requests.
    cy.reload();
    cy.wait('@getFriendRequests');

    // Validate that the friend request appears on the page.
    cy.get('#friend_requests_container').contains('bob@example.com').should('be.visible');
  });

  it('should accept a friend request', () => {
    const friendRequests = [{ id: '4', firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com' }];

    cy.intercept('GET', '/api/friendRequests', {
      statusCode: 200,
      body: friendRequests,
    }).as('getFriendRequests');

    // Intercept the patch (accept) friend request API call.
    cy.intercept('PATCH', '/api/friendship', {
      statusCode: 200,
      body: { message: 'Friend request accepted' },
    }).as('acceptFriendRequest');

    cy.reload();
    cy.wait('@getFriendRequests');

    // In the friend request container, click the accept button (the check-bold icon).
    cy.get('#friend_requests_container').within(() => {
      // Adjust selector if necessary; here we assume the first image corresponds to the accept action.
      cy.get('img').first().click();
    });
    cy.wait('@acceptFriendRequest');

    // After the request, the friend request should be removed.
    cy.get('#friend_requests_container').contains('bob@example.com').should('not.exist');
  });

  it('should decline a friend request', () => {
    const friendRequests = [{ id: '4', firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com' }];

    cy.intercept('GET', '/api/friendRequests', {
      statusCode: 200,
      body: friendRequests,
    }).as('getFriendRequests');

    // Intercept the patch (decline) friend request API call.
    cy.intercept('PATCH', '/api/friendship', {
      statusCode: 200,
      body: { message: 'Friend request declined' },
    }).as('declineFriendRequest');

    cy.reload();
    cy.wait('@getFriendRequests');

    // In the friend request container, click the decline button (the cross icon).
    cy.get('#friend_requests_container').within(() => {
      cy.get('img[src="icons/cross.png"]').click();
    });
    cy.wait('@declineFriendRequest');

    // Verify the friend request is removed after declining.
    cy.get('#friend_requests_container').contains('bob@example.com').should('not.exist');
  });
});
