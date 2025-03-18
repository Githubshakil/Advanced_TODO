function $(id) {
  return document.getElementById(id);
}

const form = $("form");
const date = $("date");
const tbody = $("tbody");
const today = new Date().toISOString().slice(0, 10);
date.value = today;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputElements = [...this.elements];
  const formData = {};

  let isValid = true;
  inputElements.forEach((element) => {
    if (element.type !== "submit") {
      if (element.value == "") {
        alert("Please fill all fields before submitting");
        isValid = false;
        return;
      }
      formData[element.name] = element.value;
    }
  });

  if (isValid) {
    formData.status = "incomplete";
    formData.id = uuid.v4();
    const tasks = getDataFromLocalStorage();
    displayToUI(formData, tasks.length + 1);
    tasks.push(formData);
    setDataToLocalStorage(tasks);
  }

  this.reset();
});

function displayToUI({ id, Name, Priority, status, date }, index) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
            <td id='no'>${index}</td>
            <td id='name'>${Name}</td>
            <td id='priority'>${Priority}</td>
            <td id='status'>${status}</td>
            <td id='date'>${date}</td>
            <td id='action'>
                <button id="delete"><i class="fas fa-trash-can"></i></button>
                <button id="check"><i class="fas fa-check-to-slot"></i></button>
                <button id="edit"><i class="fas fa-pen-nib"></i></button>
            </td>
            `;
  tr.dataset.id = id;

  tbody.appendChild(tr);
}

function getDataFromLocalStorage() {
  let tasks = [];
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
  }
  return tasks;
}

function setDataToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.onload = load;

function load() {
  tbody.innerHTML = "";
  const tasks = getDataFromLocalStorage();
  tasks.forEach((task, index) => {
    displayToUI(task, index + 1);
  });
}

// ============================= Action=======================//

tbody.addEventListener("click", function (e) {
  if (e.target.id == "delete") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    tr.remove();
    let tasks = getDataFromLocalStorage();
    tasks = tasks.filter((task) => {
      if (task.id !== id) {
        return task;
      }
    });

    setDataToLocalStorage(tasks);
    load();
  } else if (e.target.id == "check") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    const tds = tr.children;
    [...tds].forEach((td) => {
      if (td.id == "status") {
        let tasks = getDataFromLocalStorage();
        tasks = tasks.filter((task) => {
          if (task.id === id) {
            if (task.status == "complete") {
              task.status = "incomplete";
              td.innerHTML = "incomplete";
            } else {
              task.status = "complete";
              td.innerHTML = "complete";
            }
            return task;
          } else {
            return task;
          }
        });

        setDataToLocalStorage(tasks);
      }
    });
  } else if (e.target.id == "edit") {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    const tds = tr.children;

    [...tds].forEach((td) => {
      if (td.id == "name") {
        const preName = td.textContent;
        td.innerText = "";
        const input = document.createElement("input");
        input.type = "text";
        input.value = preName;
        td.appendChild(input);
      } else if (td.id == "priority") {
        const prePriority = td.textContent;
        td.innerText = "";
        const select = document.createElement("select");
        select.innerHTML = `
                         
                <option disabled>Select One</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                        
                `;

                if(prePriority==="high"){
                    select.selectedIndex = 1;
                }else if(prePriority==="Medium"){
                    select.selectedIndex = 2;
                }else if(prePriority==="Low"){
                    select.selectedIndex = 3;
                }

        td.appendChild(select);



      } else if (td.id == "date") {
        const input = document.createElement("input");
        input.type = "text";
        const preDate = td.date;
        td.innerText = "";
        input.value = preDate;
        td.appendChild(date);
      } else if (td.id == "action") {
      }
    });
  }
});
