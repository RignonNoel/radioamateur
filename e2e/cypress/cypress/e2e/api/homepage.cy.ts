describe(
    'Homepage', 
    { 
        baseUrl: 'http://api:3000'
    }, 
    () => {
        beforeEach(() => {
            // Add here some instructions you want before EACH tests
        });
    
        it('We can visit the homepage via a browser', () => {
            cy.request('/')
                .its('body')
                .should('deep.equal', { message: "Welcome to the API!" });
        });
    }
);