/**
 * @jest-environment jsdom
 */

import { getByTestId, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import { localStorageMock } from "../__mocks__/localStorage.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { bills } from "../fixtures/bills"

import mockStore from "../__mocks__/store"

jest.mock("../app/store", () => mockStore)

beforeEach(() =>{
  const html = NewBillUI()
  document.body.innerHTML = html
})

afterEach(() =>{
  document.body.innerHTML = ""
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I send the form", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const newBill = new NewBill({
        document, onNavigate, store : null, localStorage: window.localStorage
      })

      const typeChoiceInput = screen.getByTestId("expense-type")
      const bouton =  screen.getByText("Envoyer")

      expect(typeChoiceInput.value).toBe('Transports');
      const handleSubmit = jest.fn(() => newBill.handleSubmit)
      bouton.addEventListener('click', handleSubmit)
      
      userEvent.click(bouton)
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy()
    })
    test("Then the filename with the correct extension", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      
      const newBill = new NewBill({
        document, onNavigate, store : null, localStorage: window.localStorage
      })

      const nameFile1 = "1592770761.jpeg";
      const nameFile2 = "1592770761.png";
      const nameFile3 = "1592770761.jpg";
      const nameFile4 = "1592770761.ccc";
      const resultTrue1 = newBill.gestionExtension(nameFile1)
      const resultTrue2 = newBill.gestionExtension(nameFile2)
      const resultTrue3 = newBill.gestionExtension(nameFile3)
      const resultTrue4 = newBill.gestionExtension(nameFile4)
      expect(resultTrue1).toBe(true)
      expect(resultTrue2).toBe(true)
      expect(resultTrue3).toBe(true)
      expect(resultTrue4).toBe(false)
    })
    test("Then I add a file to my form", async() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      
      const newBill = new NewBill({
        document, onNavigate, store : null, localStorage: window.localStorage
      })
      const typeChoiceInput = screen.getByTestId("expense-type")
      const nameInput = screen.getByTestId("expense-name")
      const dateInput = screen.getByTestId("datepicker")
      const montantInput = screen.getByTestId("amount")
      const vatInput = screen.getByTestId("vat")
      const pctInput = screen.getByTestId("pct")
      const commentaryInput = screen.getByTestId("commentary")
      const fileInput = screen.getByTestId("file")
      const bouton =  screen.getByText("Envoyer")
      
      const testImageFile = new File(["1592770761.jpeg"], "1592770761.jpeg", { type: "image/jpeg" })
      const changeFile = jest.fn(() => newBill.handleChangeFile)
      fileInput.addEventListener('click', changeFile)
      userEvent.click(fileInput)
      //expect(fileInput.files.length).toBe(0)
      //userEvent.upload(changeFile,testImageFile)
      //expect(changeFile).toHaveBeenCalled()
    })
  })
})
