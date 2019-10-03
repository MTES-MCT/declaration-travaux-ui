/// <reference types="Cypress" />

context('Dépôts', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=appbar-connexion-btn]').should('be.visible').click()
    if (cy.isApiMock()) {
      cy.get('[data-cy=appbar-menuitem-connexion-deposant]').should('be.visible').click()
    } else {
      cy.get('#kc-login').should('be.visible')
      cy.get('#username').type('jean.martin')
      cy.get('#password').type('jean.martin')
      cy.get('#kc-login').click()
    }
  })

  it('cy.click() - go to depot page', () => {
    cy.contains("Dépôts").should('be.visible')
    cy.get('[data-cy=file-upload-btn]').should('be.visible').click()
  })
  
  it('cy.click() - ajouter depot ok', () => {
    cy.contains("Dépôts").should('be.visible')
    cy.get('[data-cy=file-upload-btn]').should('be.visible').click()
    cy.contains("Téléverser un fichier").should('be.visible')
    cy.get('[data-cy=file-upload-dropzone]').first().should('be.visible').then(function() {
      cy.fixture('cerfa_13703_DPMI.pdf', 'base64').then(fileContent => {
        cy.get('[data-cy=file-upload-dropzone]').upload({ fileContent, fileName: 'cerfa_13703_DPMI.pdf', mimeType: 'application/pdf', encoding: 'base64' },
        { subjectType: 'drag-n-drop', force: true });
      });
      cy.contains("Dépôts").should('be.visible')
      cy.get('[data-cy=piecejointe-preview-btn]').first().should('be.visible')
    })    
  })
  it('cy.click() - ajouter depot ko', () => {
    cy.contains("Dépôts").should('be.visible')
    cy.get('[data-cy=file-upload-btn]').should('be.visible').click()
    cy.contains("Téléverser un fichier").should('be.visible')
    cy.get('[data-cy=file-upload-dropzone]').first().should('be.visible').then(function() {
      cy.fixture('sample.pdf.zip', 'base64').then(fileContent => {
        cy.get('[data-cy=file-upload-dropzone]').upload({ fileContent, fileName: 'sample.pdf.zip', mimeType: 'application/zip', encoding: 'base64' },
        { subjectType: 'drag-n-drop' });
      });
      cy.contains("Fichier rejeté").should('be.visible')
      cy.contains("application/pdf").should('be.visible')
    })
    
  })
})

context('Ajouter dépôt forbidden', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-cy=appbar-connexion-btn]').should('be.visible').click()
    if (cy.isApiMock()) {
      cy.get('[data-cy=appbar-menuitem-connexion-instructeur]').should('be.visible').click()
    } else {
      cy.get('#kc-login').should('be.visible')
      cy.get('#username').type('jacques.dupont')
      cy.get('#password').type('jacques.dupont')
      cy.get('#kc-login').click()
    }
  })

  it('cy.click() - ajouter dépôt', () => {
    cy.contains("Dépôts").should('be.visible')
    cy.get('[data-cy=file-upload-btn]').should('not.be.visible')
  })
})
