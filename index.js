// VARIABLE DECLARATION
const modeToggler =  document.querySelector(".toggle_mode")
const todoForm = document.getElementById("todo_form")
const todoInput = document.getElementById("form_input")
const todoList = document.querySelector(".todo_list");
const filterElement = document.getElementById("filters")
const filterElementM = document.getElementById("mobileFilters")
const clearBtn = document.querySelector(".clearBtn")
const counter = document.querySelector(".counter")


//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", getAllTodos);
modeToggler.addEventListener("click",changeMode);
todoForm.addEventListener("submit",addTodo);
todoList.addEventListener("click", deleteCheck);
todoList.addEventListener("dragover", dragOver);
clearBtn.addEventListener("click", removeTodos);

const filterButtons = filterElement.childNodes;
filterButtons.forEach((btn)=> {
    btn.addEventListener("click",filterTodo);
    
})

const filterButtons2 = filterElementM.childNodes;
filterButtons2.forEach((btn)=> {
    btn.addEventListener("click",filterTodo);
    
})


//HANDLING MODE TOGGLER
function changeMode(){
    document.documentElement.classList.toggle("dark-mode")
    modeToggler.classList.toggle("dark")
    if (modeToggler.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
    
}

//CALC REMAINING TODOS
function remainingTodo(){
    const todos = todoList.querySelectorAll(".todo");
        var count = 0;
        todos.forEach(function(todo) {
            
            if(!todo.classList.contains("checked")) {
                count++;
            }
        })
    counter.innerHTML = `${count} items left`;
    
}

// ADDING TODO
function createTodoElement(todoText){
    const todoDiv = document.createElement("div")
    todoDiv.classList.add("todo")
    const todoLeft= document.createElement("div")
    todoLeft.classList.add("todo_left")

    const checkBtn = document.createElement("button")
    checkBtn.classList.add("check_btn")
    checkBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>'

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete")
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>';


    const newTodo = document.createElement("li")
    newTodo.classList.add("todo_item")
    newTodo.innerText = todoText;
    

    todoLeft.appendChild(checkBtn)
    todoLeft.appendChild(newTodo)
    todoDiv.appendChild(todoLeft)
    todoDiv.appendChild(deleteBtn)

    
    todoList.appendChild(todoDiv);
    
    todoDiv.setAttribute("draggable",true)
    todoDiv.addEventListener("dragstart",()=>{todoDiv.classList.add("dragging")})
    todoDiv.addEventListener("dragend",dragEnd)

    todoList.prepend(todoDiv);

    todoDiv.addEventListener("mouseenter",()=>{
        deleteBtn.style.visibility = "visible"
    })
    todoDiv.addEventListener("mouseleave",()=>{
        deleteBtn.style.visibility = "hidden"
    })

}

 function addTodo(event){
    event.preventDefault();
    console.log("Add todo");

    //SAVE TODO TO LOCAL STORAGE
    saveTodo(todoInput.value)
    createTodoElement(todoInput.value);

    // todoList.prepend(todoDiv);
    todoInput.value = "";
    remainingTodo()
    
 }

//SAVING TODO TO LOCAL STORAGE
function saveTodo(todo) {
    let todos = JSON.parse(localStorage.getItem("todos") || "[]");
    todos.push([todo,"active"]);
    localStorage.setItem("todos", JSON.stringify(todos));
}


//fetch todo values from the localStorage
function getAllTodos() {
    if(localStorage.getItem("mode") === "dark") {
        changeMode()
    } 

    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
        todos = todos.reverse()
    }
    
    todos.forEach((todo)=>{
        if(todo[1] === "active"){
            createTodoElement(todo[0])
        } 
        else{
            const todoDiv = document.createElement("div")
            todoDiv.classList.add("todo")
            const todoLeft= document.createElement("div")
            todoLeft.classList.add("todo_left")
            const todoRight = document.createElement("div")
        
            const checkBtn = document.createElement("button")
            checkBtn.classList.add("check_btn")
            checkBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>'
                     
            const deleteBtn = document.createElement("button")
            deleteBtn.classList.add("delete")
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>';
        
            const newTodo = document.createElement("li")
            newTodo.classList.add("todo_item")
            newTodo.innerText = todo[0];
            
        
            todoLeft.appendChild(checkBtn)
            todoLeft.appendChild(newTodo)
            todoDiv.appendChild(todoLeft)
            todoDiv.appendChild(deleteBtn)
        
            
            todoList.appendChild(todoDiv);

            //apply check styling
            todoDiv.classList.add("checked");
            const svg = checkBtn.getElementsByTagName("svg")[0]
            svg.classList.add("checked");

            newTodo.classList.add("checked");
            checkBtn.classList.add("checked");
            
            todoDiv.setAttribute("draggable",true)
            todoDiv.addEventListener("dragstart",()=>{todoDiv.classList.add("dragging")})
            todoDiv.addEventListener("dragend",dragEnd)

            todoDiv.addEventListener("mouseenter",()=>{
                deleteBtn.style.visibility = "visible"
            })
            todoDiv.addEventListener("mouseleave",()=>{
                deleteBtn.style.visibility = "hidden"
            })

        }
    });
    remainingTodo()
}

//function to delete or check a todo
function deleteCheck(e) {
    const item = e.target;
    const todo = item.parentElement;
    if(item.classList[0] === "delete") {
        
        removeTodos(todo);     
        todo.remove();
        //update count
        remainingTodo();
    }
    if(item.classList[0] === "check_btn") {
        item.classList.toggle("checked");

        const svg = item.getElementsByTagName("svg")[0]
        svg.classList.toggle("checked");

        const todo_item = item.nextElementSibling;
        todo_item.classList.toggle("checked");
        todo.parentElement.classList.toggle("checked");

        //update local storage
        let todos;
        if(localStorage.getItem("todos") === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem("todos"));
        }
        
        todos.forEach(function(todo) {
            if (todo[0] == todo_item.innerText){
                if (todo[1] == "active"){
                    todo[1] ="completed"
                }else{
                    todo[1] = "active"
                }
            }
           
        })
        localStorage.setItem("todos", JSON.stringify(todos));
        //update count
        remainingTodo();        
    }
}

//REMOVE TODO
function removeTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

	const todo_items = todoList.querySelectorAll(".todo");
   
        todo_items.forEach(function(todo) {
            if(todo.classList.contains("checked")) {
                todo.remove();
                
                const todoId = todo.children[0].innerText;
                const index = todos.findIndex((i) => {
                    if(i.includes(todoId)){
                        return true
                    }
                })    //find index of 2d array
            
                todos.splice(index, 1);
                localStorage.setItem("todos", JSON.stringify(todos));
                
            } 
        })
    //update count
    remainingTodo();
}



//
//function to filter todos


function filterTodo(e){
    console.log("trigger filter");
    const btn = e.target
    const todos = todoList.querySelectorAll(".todo");
   
    if(btn.innerHTML === "Active"){
        todos.forEach(function(todo) {
            if(!todo.classList.contains("checked")) {
                todo.style.display = "flex";
            } else {
                todo.style.display = "none";
            }

            //apply active styling
            const btns = btn.parentElement.querySelectorAll("li")
            btns.forEach(function(b) {
                b.classList.remove("selected")
            })
            btn.classList.add("selected")


    })}else if(btn.innerHTML === "Completed"){
        todos.forEach(function(todo) {
            if(todo.classList.contains("checked")) {
                todo.style.display = "flex";
            } else {
                todo.style.display = "none";
            }

            //apply active styling
            const btns = btn.parentElement.querySelectorAll("li")
            btns.forEach(function(b) {
                b.classList.remove("selected")
            })
            btn.classList.add("selected")
    })}else{
        todos.forEach(function(todo) {
            todo.style.display = "flex";

            //apply active styling
            const btns = btn.parentElement.querySelectorAll("li")
            btns.forEach(function(b) {
                b.classList.remove("selected")
            })
            btn.classList.add("selected")
            })
    }
   
}


function dragOver(e){
    e.preventDefault()
    const draggable = document.querySelector(".dragging")
    const afterElement = getElementPosition(e.clientY)
    if (afterElement == null) {
        todoList.appendChild(draggable)
    }else{
        todoList.insertBefore(draggable,afterElement)
    }
}

function getElementPosition(yPos){
    const elements = [...todoList.querySelectorAll(".todo:not(.dragging)")]
    
    
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = yPos - box.top -box.height/2
        if(offset < 0 && offset >closest.offset){
            return{offset:offset,element:child}
        }
        else{
            return closest
        }
    },{offset:Number.NEGATIVE_INFINITY}).element
}

function dragEnd(e){
    //remove dragging effect
    e.target.classList.remove("dragging")

    //update localstorage with current arrangements
    let todos = [];
    const newlist = [...todoList.querySelectorAll(".todo")]
    newlist.forEach((item)=>{
        if (item.classList[1] == "checked"){
            todos.push([item.children[0].children[1].innerText,"completed"])
        }else{
            todos.push([item.children[0].children[1].innerText,"active"])
        }
    })
    todos = todos.reverse()
    localStorage.setItem("todos", JSON.stringify(todos));
   
}
