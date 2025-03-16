function $(id){
    return document.getElementById(id)
}

const form = $('form')
const date = $('date')
const tbody = $('tbody')


let today = new Date()
today.toISOString()
date.value = today.toISOString().slice(0,10) 

form.addEventListener('submit', function(e){
e.preventDefault()
const inputElements = ([...this.elements]);

const formData = {}
inputElements.forEach(element => {
   if(element.type !== 'submit'){
       formData[element.name] = element.value
   }
  
})


formData.status = 'incomplete';



displayToUI(formData)


});


function displayToUI({name, priority, status, date}){
    const tr = document.createElement('tr')
    tr.innerHTML = `
            <td>0</td>
            <td>${name}</td>
            <td>${priority}</td>
            <td>${status}</td>
            <td>${date}</td>
            <td>
                <button id="delete"><i class="fas fa-trash-can"></i></button>
                <button id="check"><i class="fas fa-check-to-slot"></i></button>
                <button id="edit"><i class="fas fa-pen-nib"></i></button>
            </td>`

    tbody.appendChild(tr)
}