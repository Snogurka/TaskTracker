//toggle the display of the task list and task entry panels
function toggleTaskPane(tgt) {

  //reverse the clicked button (arrow via border)
  if (window.getComputedStyle(tgt).borderTopStyle === "none") {
    tgt.style.borderTop = "1em solid olive"
    tgt.style.borderBottom = "none";
  } else {
    tgt.style.borderTop = "none";
    tgt.style.borderBottom = "1em solid olive";
  }

  //determine which section to hide and which to expand based on the button clicked
  let sectionToHide = null, sectionToStretch = null;
  if (tgt.id==="rollUp") {
    sectionToHide = document.getElementById("taskList");
    sectionToStretch = document.getElementById("taskEntry")
  } else {
    sectionToHide = document.getElementById("taskEntry");
    sectionToStretch = document.getElementById("taskList")
  }

  //if unhiding..
  if (sectionToHide.style.display === "none") {
    //if unhiding the task list section
    if (sectionToHide.id === "taskList") {
      sectionToHide.style.display = "block";
      sectionToStretch.getElementsByTagName("textArea")[0].style.gridRowEnd = "14";
    }
    //if unhiding the task entry section 
    else {
      sectionToHide.style.display = "grid";
      sectionToStretch.style.height = "30vh";
    }
  } 
  //if hiding
  else {
    sectionToHide.style.display = "none";
    //if hiding the task list section
    if (sectionToHide.id === "taskList") {
      sectionToStretch.style.height = "90vh";
      sectionToStretch.getElementsByTagName("textArea")[0].style.gridRowEnd = "30";
    }
    else {
      sectionToStretch.style.height = "70vh";
    }
  }
 }

//hide the color buttons in the task entry panel
function toggleColorButtons(tgt) {
  //  capture the coloring buttons container
  let colorButtons = tgt.parentElement;
  let len = colorButtons.children.length-1;

  //check if it's a mobile device, in which case there will be a border top or buttom on the color toggle button, which is the last one in colorButtons
  var mainBtnColor = getComputedStyle(document.documentElement).getPropertyValue('--main-btn-color');
  let mobile = window.getComputedStyle(colorButtons.children[len]).borderTopColor === mainBtnColor || window.getComputedStyle(colorButtons.children[len]).borderBottomColor === mainBtnColor;

  //loop through coloring buttons and toggle their display
  for (let i = 0; i < len; i++) {
    if (colorButtons.children[i].style.position === "fixed") {
      colorButtons.children[i].style.position = "";
      colorButtons.children[i].style.opacity = "1";
    } else {
      colorButtons.children[i].style.position = "fixed";
      colorButtons.children[i].style.opacity = "0";
    }
  }

  //change the border to show the needed arrow direction, left/right for desktop and top/bottom for mobile
  let arrowSpecs = "1em solid " + mainBtnColor;
  if (colorButtons.children[len].style.position === "fixed") {
    colorButtons.children[len].style.position = "";
    if (mobile) {
      colorButtons.children[len].style.borderTop = "none";
      colorButtons.children[len].style.borderBottom = arrowSpecs;     
    } 
    else {
      colorButtons.children[len].style.borderRight = arrowSpecs;
      colorButtons.children[len].style.borderLeft = "none";  
    }
  } 
  else {
    colorButtons.children[len].style.position = "fixed";
    if (mobile) {
      colorButtons.children[len].style.borderTop = arrowSpecs;
      colorButtons.children[len].style.borderBottom = "none";  
    } 
    else {
      colorButtons.children[len].style.borderRight = "none";
      colorButtons.children[len].style.borderLeft = arrowSpecs;
    }
  }

}

//response to clicking on color buttons, determine what to do
function changeColors(e, real) {

  // if a color pallette button or its child, input field, is clicked
  if (e.target.id === "btnColorPick" || e.target.parentElement.id === "btnColorPick" ) {
    //exit, if this is a click on the color input field itself, not the color choice selection
    if (!real) return;
    //shouldn't need this, set to black if no color
    let col = e.srcElement.value?e.srcElement.value:"#000000";
  
    //color picker is handled by the "onchange" handler; 
    setTextColor(col);
    
    //set the background of custom color botton to the selected color
    e.target.parentElement.style.backgroundColor = col;
    return;
  }

  // if any other color botton is clicked, prevent default so the form doesn't clear and change the color to the one selected
  e.preventDefault();
  if (e.target.id === "btnColorDisplay") {
    toggleColorButtons(e.target);
  }
  else if (e.target.id === "btnSnow" || e.target.id === "btnFlower") {
    setTextBg(e.target)
  }
  else if (e.target.parentElement.id === "colorButtons") {
    setTextColor(window.getComputedStyle(e.target).backgroundColor);
  }
 }

//set the text color of the task name and text based on user selection; the function is called from changeColors; the color parameter is in RGB form
function setTextColor(color) {
  let taskName = document.getElementById("taskName")
  let taskText = document.getElementById("taskText");

  //if color is in hex (base 16) format, convert it to RGB
  if (color.toString()[0]==="#") {
    color = color.toString();
    if (color.slice(1).length===6) {
      color = "rgb("
      + parseInt(color.slice(1,3),16) + ","
      + parseInt(color.slice(3,5),16) + ","
      + parseInt(color.slice(5),16) + ")"
    }
  }

  //the following extracts the V of HSV, aka the brightness of the color from the color parameter supplied; if brightness is less than 0.7, then make the background lighter; the function pulls the max out of each of the rgb values divided by 255
  if (color.slice(4).split(",").map(x=>parseFloat(x)/255.0).reduce((a,b)=>a>b?a:b) < 0.75) {
    taskName.style.backgroundImage = "url('whitePaperLg.png')";
    taskText.style.backgroundImage = "url('whitePaperLg.png')";
  } else {
    taskName.style.backgroundImage = "url('blackPaperLg.png')";
    taskText.style.backgroundImage = "url('blackPaperLg.png')";   
  }
  taskName.style.color = color;
  taskText.style.color = color;
}

//set task text border background - in progress
function setTextBg (tgt){
  let taskTextWindow = document.getElementById("taskText");
  let imgName = tgt.innerText === "❄️"?"snowflake":"flower";

  // taskTextWindow.style.borderImage = "linear-gradient(#fffafa, #0000ff) 30";
  
  taskTextWindow.style.border= "24px";
  taskTextWindow.style.webkitBorderImage = `url('${imgName}.png') 24 repeat`;
  
  // taskTextWindow.style.borderImage = `url('${imgName}.png')`;
  // taskTextWindow.style.borderImageRepeat = "repeat";

  // taskTextWindow.style.backgroundImage = `url('${imgName}.png')`;
}

//save new or update existing task - on hold, would like to store elsewhere
function saveTask(e) {
  
  e.preventDefault();

  //capture the task name and text fields; exit, if both are empty;
  let taskName = document.getElementById("taskName").value;
  let taskText = document.getElementById("taskText");
  if (!taskName && !taskText.value) {
    return;
  } 
  else if (!taskName) {
    // taskName = taskText.value;
    taskName = taskText.value.slice(0,20);
  }

  //create a new list item with task name, store its color and text as attributes
  let newTaskLi = document.createElement("LI");
  newTaskLi.className = "task";
  newTaskLi.style.color = taskText.style.color;
  newTaskLi.setAttribute("taskColor", taskText.style.color);
  newTaskLi.innerHTML = taskName;
  newTaskLi.setAttribute("taskText", taskText.value);

  //add a delete button to the new task
  let deleteBtn = document.createElement("BUTTON");
  deleteBtn.className = "btnDelete";
  deleteBtn.innerText = "🗑";
  newTaskLi.appendChild(deleteBtn);

  //add a due date, if it's been filled out
  let taskDueDate = document.getElementById("dueDate").value;
  // newTaskLi.setAttribute("dueDate", taskDueDate);
  if (taskDueDate) {
    let dueDate = document.createElement("SPAN");
    dueDate.className = "dueDateText";
    dueDate.innerText = "Due:\xa0" + taskDueDate;
    newTaskLi.appendChild(dueDate);
  }

  document.getElementById("taskList").appendChild(newTaskLi);

  //store the new task and its attributes in local storage, for now
  // localStorage.setItem("aas_taskTracker", `'${taskName}', '${taskText.value}', '${taskDueDate}', '${taskText.style.color}'`);

}
function addToLocal() {
  let counter = 0;
  if (localStorage.getItem("aad_taskTracker_counter")) {
    counter = Math.max(localStorage.getItem("aad_taskTracker_counter"))+1;
  }
  // on hold, see above
}

//clear name, text, date and color choice in task entry panel
function clearTaskEntry(e) {
  e.preventDefault();
  ["taskName", "taskText"].forEach(i => {
    let x = document.getElementById(i);
    x.value = '';
    x.style.color = "snow";
  });
  document.getElementById("dueDate").value = '';
  document.getElementById("btnColorPick").style.background = '';
}

//response to clicking on a task list item, aka task
function taskListResponse(tgt) {
  if (tgt.className === "task") {
    loadTask(tgt);
  } 
  else if (tgt.className === "dueDateText") {
    loadTask(tgt.parentElement);
  }
  else if (tgt.className === "btnDelete") {
    deleteTask(tgt.parentElement);
  }
}

//add the new or updated task to the list of tasks
function loadTask(tgt) {
  let taskName = document.getElementById("taskName");
  let taskText = document.getElementById("taskText");
  // let dueDate = document.getElementById("dueDate");
  let duePlace = tgt.innerText.search("Due:")>-1?tgt.innerText.search("Due:"):tgt.innerText.length;

  //set the task name to the stored task value less trashcan and date
  taskName.value = tgt.innerText.slice(0,duePlace-2);
  taskName.style.color = tgt.getAttribute("taskColor");

  //if due date is stored, it's after words "Due:" and through the end of string (can also store in the attribute)
  if (tgt.innerText.slice(duePlace+5)) {
    document.getElementById("dueDate").value = tgt.innerText.slice(duePlace+5);
  }

  //if task text is present, it's in the taskText attribute
  if (tgt.getAttribute("taskText")) {
    taskText.value = tgt.getAttribute("taskText");
  }
  taskText.style.color = tgt.getAttribute("taskColor");

}

//click on a trushcan button of a task - need a warning
function deleteTask(li) {
  let sure = confirm("Delete task?");
  if (sure) li.parentElement.removeChild(li);
}
