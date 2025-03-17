function $(id){
    return document.getElementById(id)
}

const form = $('form')
const date = $('date')
const tbody = $('tbody')
const today = new Date().toISOString().slice(0, 10);
date.value = today;







form.addEventListener('submit', function(e){
e.preventDefault()
const inputElements = [...this.elements];
const formData = {}

let isValid = true;
inputElements.forEach(element => {
   if(element.type !== 'submit'){
    if(element.value == ''){
        alert('Please fill all fields before submitting');
        isValid = false;
        return;
    }
     formData[element.name] = element.value;
   }
  
})


if(isValid){
    formData.status = 'incomplete';
    formData.id = uuid.v4();
    displayToUI(formData);
    const tasks = getDataFromLocalStorage();
    tasks.push(formData);
    setDataToLocalStorage(tasks);
    
    
}

this.reset()


});


function displayToUI({
    id,
    Name, 
    Priority, 
    status, 
    date
}){
    const tr = document.createElement('tr')
    tr.innerHTML = `
            <td>0</td>
            <td>${Name}</td>
            <td>${Priority}</td>
            <td>${status}</td>
            <td>${date}</td>
            <td>
                <button id="delete"><i class="fas fa-trash-can"></i></button>
                <button id="check"><i class="fas fa-check-to-slot"></i></button>
                <button id="edit"><i class="fas fa-pen-nib"></i></button>
            </td>
            `
            tr.dataset.id = id;

            tbody.appendChild(tr)
        }

        function getDataFromLocalStorage(){
            let tasks = [];
            const data = localStorage.getItem('tasks');
            if(data){
                tasks = JSON.parse(data);
            }
            return tasks;
        }

        function setDataToLocalStorage(tasks){
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }