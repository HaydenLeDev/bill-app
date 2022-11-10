/**
 * @jest-environment jsdom
 */

import { fireEvent , screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import { localStorageMock } from "../__mocks__/localStorage.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { bills } from "../fixtures/bills"
import mockedBills from "../__mocks__/store.js";
import mockStore from "../__mocks__/store";

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
        document, onNavigate, store : mockedBills, localStorage: window.localStorage
      })

      const fileInput = screen.getByTestId("file")
      const file = [new File(["test"], "test.jpg", { type: "image/jpg" })]
      const changeFile = jest.fn(() => newBill.handleChangeFile)
      fileInput.addEventListener("change", changeFile)
      fireEvent.change(fileInput, {
        target: {
          files: file
        }
      })
      expect(changeFile).toBeCalled()
      expect(fileInput.files[0].name).toBe("test.jpg")
    })
  })

  // Integration test POST
  describe ("I submit a valid bill form", () => {
    test("then a new bill", async() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document, onNavigate, store: mockedBills, localStorage:window.localStorage
      })
      const newValidBill = {
        name: "Bill test",
        date: "2022-11-12",
        type: "Hôtel et logement",
        amount: 200,
        pct: 20,
        vat: "40",
        commentary: "Test new bill",
        fileName: "test.jpg",
        fileUrl: "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
      }

      const buttonSubmit = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      document.querySelector(`input[data-testid="expense-name"]`).value = newValidBill.name
      document.querySelector(`input[data-testid="datepicker"]`).value = newValidBill.date
      document.querySelector(`select[data-testid="expense-type"]`).value = newValidBill.type
      document.querySelector(`input[data-testid="amount"]`).value = newValidBill.amount
      document.querySelector(`input[data-testid="vat"]`).value = newValidBill.vat
      document.querySelector(`input[data-testid="pct"]`).value = newValidBill.pct
      document.querySelector(`textarea[data-testid="commentary"]`).value = newValidBill.commentary
      newBill.fileUrl = newValidBill.fileUrl
      newBill.fileName = newValidBill.fileName
      buttonSubmit.addEventListener('click', handleSubmit)
      fireEvent.click(buttonSubmit)
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    })
  })
})
