describe(
    'Homepage', 
    () => {
        beforeEach(() => {
        });
    
        it('We can freely visit the homepage', () => {
            cy.visit('/');
            cy.get('app-default').should('be.visible');
            cy.get('app-default').contains('Transmettez votre passion, au-delà des frontières').should('be.visible');
        });
    }
);