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
    //
    let nameTd;
    let newNameField;
    let priorityTd;
    let prioritySelect;
    let dateTd;
    let dateInputFild;
    let actionTd;
    let preButtons;

    [...tds].forEach((td) => {
      if (td.id == "name") {
        nameTd = td;
        const preName = td.textContent;
        td.innerText = "";
        newNameField = document.createElement("input");
        newNameField.type = "text";
        newNameField.value = preName;
        td.appendChild(newNameField);
      } else if (td.id == "priority") {
        priorityTd = td;
        const prePriority = td.textContent;
        td.innerText = "";
        prioritySelect = document.createElement("select");
        prioritySelect.innerHTML = `
                         
                <option disabled>Select One</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                        
                `;

        if (prePriority === "high") {
          prioritySelect.selectedIndex = 1;
        } else if (prePriority === "Medium") {
          prioritySelect.selectedIndex = 2;
        } else if (prePriority === "Low") {
          prioritySelect.selectedIndex = 3;
        }

        td.appendChild(prioritySelect);
      } else if (td.id == "date") {
        dateTd = td;
        const preDate = td.textContent;
        td.innerText = "";
        dateInputFild = document.createElement("input");
        dateInputFild.type = "date";
        dateInputFild.value = preDate;
        td.appendChild(dateInputFild);
      } else if (td.id == "action") {
        actionTd = td;
        preButtons = td.innerHTML;
        td.innerHTML = "";
        const saveBtn = document.createElement("button");
        saveBtn.innerHTML = "<i class='fas fa-sd-card'></i>";
        saveBtn.addEventListener("click", function () {
          //name
          const newName = newNameField.value;
          nameTd.innerHTML = newName;
          //priority
          const newPriority = prioritySelect.value;
          priorityTd.innerHTML = newPriority;
          //date
          const newDate = dateInputFild.value;
          dateTd.innerHTML = newDate;

          //action buttonn
          actionTd.innerHTML = preButtons;
          ///save modified task ifo local storage
          let tasks = getDataFromLocalStorage();
          tasks = tasks.filter((task) => {
            if (task.id === id) {
              task.Name = newName;
              task.Priority = newPriority;
              task.date = newDate;
              return task;
            } else {
              return task;
            }
          });
          setDataToLocalStorage(tasks)
        });
        td.appendChild(saveBtn);
      }
    });
  }
});
