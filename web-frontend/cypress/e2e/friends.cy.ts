describe('Friends Page', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should display loading spinner when friends are being loaded', () => {
    // Intercept the GET friends call and simulate a delay
    cy.intercept('GET', '/api/friends', (req) => {
      req.reply((res) => {
        res.delay = 500;
      });
    }).as('getFriendsLoading');

    cy.visit('http://localhost:4200/friends');

    // When the friends loading flag is true, the spinner should be visible.
    cy.get('.loading-container').should('be.visible');
  });

  it('should show message when there are no friends', () => {
    cy.intercept('GET', /friendship\/.*\/friends/, {
      statusCode: 404,
      body: {},
    }).as('getEmptyFriends');

    cy.visit('http://localhost:4200/friends');

    cy.wait('@getEmptyFriends');
    cy.get('[data-cy="no-friends-message"]').should('be.visible');
  });

  it('should display friends list when friends are returned', () => {
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

    cy.wait('@getFriends');
    cy.contains('Alice Anderson').should('be.visible');
    cy.contains('alice@example.com').should('be.visible');
  });

  it('should delete a friend', () => {
    const friends = [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Anderson',
        email: 'alice@example.com',
        profilePictureBase64: null,
      },
    ];

    // Intercept initial list of friends
    cy.intercept('GET', /friendship\/.*\/friends/, {
      statusCode: 200,
      body: friends,
    }).as('getFriends');

    // Intercept delete request
    cy.intercept('DELETE', /friendship/, {
      statusCode: 200,
      body: {},
    }).as('deleteFriend');

    cy.visit('http://localhost:4200/friends');

    cy.wait('@getFriends');

    // Check that the friend is visible first
    cy.contains('Alice Anderson').should('be.visible');

    // Open options menu
    cy.get('.friend').first().find('.action_button').click();

    // Click delete button
    cy.get('#options').find('button').click();

    // Wait for delete request
    cy.wait('@deleteFriend');

    // Friend should disappear
    cy.contains('Alice Anderson').should('not.exist');
  });

  it('should search and display users by email', () => {
    const searchResult = [
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Baker',
        email: 'bob@example.com',
        profilePictureBase64: null,
      },
    ];

    // Intercept the search API call
    cy.intercept('GET', /user\?email=.*/, {
      statusCode: 200,
      body: searchResult,
    }).as('searchUsers');

    cy.visit('http://localhost:4200/friends');

    // Type into the search input and press Enter
    cy.get('[data-cy="search_friend_search_input"]').type('bob@example.com{enter}');

    // Wait for search request
    cy.wait('@searchUsers');

    // Assert that the search result appears
    cy.contains('bob@example.com').should('be.visible');
  });

  it('should send a friend request when clicking add friend button', () => {
    const searchResult = [
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Baker',
        email: 'bob@example.com',
        profilePictureBase64: null,
      },
    ];

    // Intercept the search API call
    cy.intercept('GET', /user\?email=.*/, {
      statusCode: 200,
      body: searchResult,
    }).as('searchUsers');

    // Intercept the send friend request API call
    cy.intercept('POST', /friendship/, {
      statusCode: 201,
      body: {},
    }).as('sendFriendRequest');

    cy.visit('http://localhost:4200/friends');

    // Type into search and submit
    cy.get('[data-cy="search_friend_search_input"]').type('bob@example.com{enter}');

    // Wait for search results
    cy.wait('@searchUsers');

    // Click the follow button (follow icon next to the found user)
    cy.get('#search_result_container').find('img[src="icons/follow.png"]').click();

    // Wait for the friend request to be sent
    cy.wait('@sendFriendRequest');

    // Assert that the button is now changed (the icon should now be the checkmark)
    cy.get('#search_result_container').find('img[src="icons/check.png"]').should('exist').and('have.css', 'pointer-events', 'none');
  });

  it('should display friend requests', () => {
    const friendRequests = [
      { id: '3', email: 'charlie@example.com' },
      { id: '4', email: 'diana@example.com' },
    ];

    cy.intercept('GET', /friendship\/.*\/friend-requests/, {
      statusCode: 200,
      body: friendRequests,
    }).as('getFriendRequests');

    cy.visit('http://localhost:4200/friends');

    cy.wait('@getFriendRequests');

    // Check if the friend request emails are visible
    cy.contains('charlie@example.com').should('be.visible');
    cy.contains('diana@example.com').should('be.visible');
  });

  it('should accept a friend request', () => {
    const friendRequests = [{ id: '5', email: 'eve@example.com' }];

    cy.intercept('GET', /friendship\/.*\/friend-requests/, {
      statusCode: 200,
      body: friendRequests,
    }).as('getFriendRequests');

    cy.intercept('PATCH', /friendship/, {
      statusCode: 200,
      body: {},
    }).as('acceptFriendRequest');

    cy.visit('http://localhost:4200/friends');

    cy.wait('@getFriendRequests');

    // Find the accept button (check icon) next to eve@example.com
    cy.contains('eve@example.com').parent().find('img[src="icons/check-bold.png"]').click();

    cy.wait('@acceptFriendRequest');

    // After accepting, eve@example.com should disappear
    cy.contains('eve@example.com').should('not.exist');
  });

  it('should decline a friend request', () => {
    const friendRequests = [{ id: '6', email: 'frank@example.com' }];

    cy.intercept('GET', /friendship\/.*\/friend-requests/, {
      statusCode: 200,
      body: friendRequests,
    }).as('getFriendRequests');

    cy.intercept('PATCH', /friendship/, {
      statusCode: 200,
      body: {},
    }).as('declineFriendRequest');

    cy.visit('http://localhost:4200/friends');

    cy.wait('@getFriendRequests');

    // Find the decline button (cross icon) next to frank@example.com
    cy.contains('frank@example.com').parent().find('img[src="icons/cross.png"]').click();

    cy.wait('@declineFriendRequest');

    // After declining, frank@example.com should disappear
    cy.contains('frank@example.com').should('not.exist');
  });
});
