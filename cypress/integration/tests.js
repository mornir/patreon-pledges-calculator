// type definitions for Cypress object "cy"
/// <reference types="cypress" />

import onePledge from "../fixtures/onePledge.json"
import manyPledges from "../fixtures/manyPledges.json"

const textarea = "textarea[data-cy=json-textarea]"
const button = "button[data-cy=json-button]"
const creatorsList = "ul[data-cy=creators-list]"

describe("Sad Paths", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  context("Sad Paths", () => {
    it("rejects empty required input", () => {
      cy.get(textarea + ":invalid").should("have.length", 1)
      cy.get(textarea).type("hello")
      cy.get(textarea + ":invalid").should("have.length", 0)
    })

    it("displays an appropriate error message when JSON format is invalid", () => {
      cy.get(textarea).type("hello")
      cy.get(button).click()
      cy.contains("Invalid JSON")
    })

    it("displays an appropriate error message when JSON structure is invalid", () => {
      cy.get(textarea).type('{ "test": "test" }', {
        parseSpecialCharSequences: false,
      })
      cy.get(button).click()
      cy.contains("Unexpected JSON structure:")
    })
  })

  context("Happy Paths", () => {
    it("handles one single pledge", () => {
      const stringObject = JSON.stringify(onePledge)
      cy.get(textarea).clear().invoke("val", stringObject).trigger("input")
      cy.get(button).click()

      cy.contains("You have pledged a total amount of $10.")

      cy.get(creatorsList + " li")
        .should("have.length", 1)
        .first()
        .should("contain", "John Leider")
        .should("contain", "$10.00")
    })

    it("handles many pledges", () => {
      const stringObject = JSON.stringify(manyPledges)

      cy.get(textarea).clear().invoke("val", stringObject).trigger("input")
      cy.get(button).click()

      cy.contains("You have pledged a total amount of $233 over 4 years.")

      cy.get(creatorsList + " li")
        .should("have.length", 20)
        .first("")
        .should("contain", "Da Peng - 大鹏")
        .should("contain", "$10.00")

      cy.get(creatorsList + " li")
        .last()
        .should("contain", "John Leider")
        .should("contain", "$50.00")
    })
  })
})
