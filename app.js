// Employee Class
class Employee {
  constructor(name, officeNum, phoneNum) {
    this.name = name;
    this.officeNum = officeNum;
    this.phoneNum = phoneNum;
  }
}

//UI Class : Handles UI Task
class UI {
  static displayEmployees() {
    let employees = Store.getEmpployees();
    employees.forEach((employee) => UI.addEmployeeToList(employee));
  }

  static addEmployeeToList(employee) {
    const list = document.querySelector("#employee-list");

    const row = document.createElement("tr");
    row.className = `employeeData`;

    row.innerHTML = `
              <td id="employeeName">${employee.name}</td>
              <td>${employee.officeNum}</td>
              <td>${employee.phoneNum}</td>
              <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
          `;

    list.appendChild(row);
  }
  static deleteEmployee(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#employee-form");
    container.insertBefore(div, form);

    // Remove alert after 3s
    setTimeout(() => document.querySelector(".alert").remove(), 9000);
  }

  static clearFields() {
    document.getElementById("employee-form").reset();
  }
}

//Store Class: Handle Storage
class Store {
  static getEmpployees() {
    let employees;
    if (localStorage.getItem("employees") === null) {
      employees = localStorage.setItem(
        "employees",
        JSON.stringify(employeeList)
      );
    } else {
      employees = JSON.parse(localStorage.getItem("employees"));
    }
    return employees;
  }

  static addEmployee(employee) {
    const employees = Store.getEmpployees();
    employees.push(employee);
    localStorage.setItem("employees", JSON.stringify(employees));
  }

  static removeEmploye(officeNum) {
    const employees = Store.getEmpployees();

    employees.forEach((employee, index) => {
      if (employee.officeNum === officeNum) {
        employees.splice(index, 1);
      }
    });

    localStorage.setItem("employees", JSON.stringify(employees));
  }
}

//Event : Display Employee
document.addEventListener("DOMContentLoaded", UI.displayEmployees);

// Search Employee Event
document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search");
  const rows = document.querySelectorAll("tbody tr ");
  searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();
    rows.forEach((row) => {
      row.querySelector("td").textContent.toLowerCase().startsWith(searchString)
        ? (row.style.display = "")
        : (row.style.display = "none");
    });
  });
});
//Event: Update a Employee

document.querySelector("#name").addEventListener("keyup", (e) => {
  let inputText = e.target.value;
  let employees = JSON.parse(localStorage.getItem("employees"));
  const officeNum = document.querySelector("#officeNum").value;
  const phoneNum = document.querySelector("#phoneNum").value;
  if (employees.some((e) => e.name === inputText)) {
    let update = document.querySelector(".submitBtn");
    update.className = "bg-warning btn-block";
    update.textContent = " Update Employee";

  }

  let index = employees.findIndex((element) => element.name === inputText);
  (employees[index].officeNum) = officeNum;
  (employees[index].phoneNum) = phoneNum;
  console.log(employees[index]);
  console.log(employees);
});

//Event: Add a Employe
document.querySelector("#employee-form").addEventListener("submit", (e) => {
  // Prevents actual submit
  e.preventDefault();

  //Get form values
  const name = document.querySelector("#name").value;

  const officeNum = document.querySelector("#officeNum").value;
  const phoneNum = document.querySelector("#phoneNum").value;
  // validate the form
  if (name === "" || officeNum === "" || phoneNum === "") {
    UI.showAlert("Please fill in all the fields", "danger");
  } else {
    // Instatiate Employee
    const employee = new Employee(name, officeNum, phoneNum);

    // Add employee to UI
    UI.addEmployeeToList(employee);

    // Add employee to store
    Store.addEmployee(employee);

    //Sucess message
    UI.showAlert("New employee added", "success");

    //Clear form fields
    UI.clearFields();
  }
});

//Event : Remove a Book
document.querySelector("#employee-list").addEventListener("click", (e) => {
  //Remove employe from UI
  UI.deleteEmployee(e.target);

  //Remove employe from Store
  Store.removeEmploye(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .textContent
  );

  //Remove message
  UI.showAlert(" Employee Removed", "success");
});
