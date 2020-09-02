const employeesElement = document.querySelector('#employees');
const employeesHeaderElement = document.querySelector('#employeesHeader');
const employeesBodyElement = document.querySelector('#employeesBody');
const inputFields = document.querySelectorAll('#addEmployeeForm input[name]');
const addEmployee = document.querySelector('#addEmployee');
const addEmployeeForm = document.querySelector('#addEmployeeForm');
let employeesData =  employeesDataMock;

function renderEmployees(employees) {
    const employeeHeaders = employees[0];
    let trElement = document.createElement('tr');
    employeesHeaderElement.innerHTML = '';
    employeesBodyElement.innerHTML = '';
    let col = 0;
    for(let employee in employeeHeaders) {
        employee = employee.replace(/([A-Z])/g, ' $1').trim();  //  text formatting eg. jobTitleName => Job Title Name
        trElement.innerHTML += `<td onclick="sortByColumn(${col})">${employee}</td>`;
        col += 1;
    }
    // actions => edit, delete
    trElement.innerHTML += `<td>Actions</td>`;

    employeesHeaderElement.appendChild(trElement);

    for(let employee of employees) {
        let trElement = document.createElement('tr');
        for(let title in employee) {
            trElement.innerHTML += `<td>${employee[title]}</td>`;
        }
        trElement.innerHTML += `<td>
                                    <span onclick= "actions('edit', '${employee.employeeCode}')" class="action-btn mr-1">Edit</span>
                                    <span onclick= "actions('delete', '${employee.employeeCode}')" class="action-btn action-btn-delete">Delete</span>
                                </td>`;
        employeesBodyElement.appendChild(trElement);
    }
};

async function getEmployees() {
    let employees;
    const url = 'https://my-json-server.typicode.com/darshanp40/employeedb/employees';
    try {
        // let res = await fetch(url);
        // employees = await res.json();
        // employeesData = employees[0];
        renderEmployees(employeesData);
    } catch (error) {
        console.log(error);
    }
};

async function addEmployeeSubmit(e) {
    e.preventDefault();
    const url = 'https://my-json-server.typicode.com/darshanp40/employeedb/employees';
    let employee = {
        id: employeesData.length + 1
    };

    for ( let input of inputFields ) {
        employee[input.name] = input.value;
    }

    const params = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
    }
    employeesData.push(employee);
    renderEmployees(employeesData);
    showAddEmployeeForm('none');

    try {
        // const res = await fetch(url, params);
        // const post = await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function deleteEmployee(employeeCode) {
    // emulate API
    employeesData = employeesData.filter((emp) => {
        return emp.employeeCode !== employeeCode;
    });

    renderEmployees(employeesData);
}

function searchEmployee(searchValue) {
    let trs = document.querySelectorAll('#employeesBody tr');
    for(let tr of trs) {
        for(let td of tr.childNodes) {
            if( td.innerText.toLowerCase().indexOf( searchValue.toLowerCase() ) > -1 ) {
                tr.style.display = '';
                break;
            } else {
                tr.style.display = 'none';
            }
        }
    }
}

function actions(type, employeeCode) {
    switch(type) {
        case 'edit' : setEditForm(employeeCode); break;
        case 'delete' : deleteEmployee(employeeCode); break;
    }
}

function setEditForm(employeeCode) {
    showAddEmployeeForm();
    const employee = employeesData.filter((emp) => {
        return emp.employeeCode === employeeCode;
    })[0];

    for ( let input of inputFields ) {
        input.value = employee[input.name];
    }
}

function showAddEmployeeForm(display = 'block') {
    addEmployeeForm.reset();
    addEmployee.style.display =  display;
}

function sortByColumn(col) {
    let trs = document.querySelectorAll('#employeesBody tr');
    for(tr of trs) {
        if(tr.nextSibling) {
            let currentTD = tr.querySelectorAll('td')[col].innerText;
            let nextTD = tr.nextSibling.querySelectorAll('td')[col].innerText;

            if(nextTD < currentTD) {
                swapTrs(tr.nextSibling, tr);
            }
        }
    
    }
}

function swapTrs(nextTR, currentTR) {
    currentTR.parentNode.insertBefore(nextTR, currentTR);
}

getEmployees();