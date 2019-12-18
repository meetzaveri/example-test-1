localStorage.clear();
const table = document.getElementById("emailTable");
const len = table.rows.length;
console.log("length of email list", len);
let enabledUsers = [];
let disabledUsers = [];
const currentEmailList = localStorage.getItem("emailList");

// Convert Array to string for localstorage operation
function arrToStr(arr) {
  const newStr = arr.join(",");
  console.log("newStr emails", newStr);
  return newStr;
}

// Utility for string to array conversion
function fromStrToArr(str) {
  let arr = [];

  if (str && str.includes(",")) {
    const newArr = str.split(",");
    arr = newArr;
  }
  return arr;
}

function handleOnKeyPress(e) {
  // Delegate enter key press for email input form submit
  submit();
}

// Submit form action
function submit() {
  const len = table.rows.length;
  let newId = parseInt(len + 1);
  let email = document.forms["myForm"]["email"].value;

  document.forms["myForm"]["email"].value = "";
  console.log("form submit", email);

  const rawData = localStorage.getItem("emailList");
  const newArr = rawData ? rawData.split(",") : [];
  console.log("newArr", newArr);
  if (newArr.includes(email)) {
    alert("Email already exists");
  } else {
    newArr.push(email);
    localStorage.setItem("emailList", arrToStr(newArr));
    insertRow(email, newId, true);
    enabledUsers.push(newId);
  }

  return false;
}

// Handle search email functionality
function handlechange(e) {
  const key = document.getElementById("searchTxt").value;
  const emailList = localStorage.getItem("emailList");
  const arr = fromStrToArr(emailList);
  const udpatedArr = arr.filter(i => i.includes(key));
  console.log("final Arr", udpatedArr);
  updateRows(udpatedArr);
}

// deletes table row
function deleteTableRow(row) {
  let i = row.parentNode.parentNode.rowIndex;
  document.getElementById("emailTable").deleteRow(i);
}

function insertRow(email, id, ifChecked) {
  let table = document.getElementById("emailTable");
  let newRow = document.createElement("tr");
  let cell1 = document.createElement("td");
  let cell2 = document.createElement("td");
  let cell3 = document.createElement("td");
  cell1.innerHTML = `<input id='check-${id}' name='check-${id}' type="checkbox" ${
    ifChecked ? "checked" : ""
  } onchange="handleOnCheck(event)"/>`;
  cell2.innerHTML = `${email}`;
  cell3.innerHTML = `<button id='btn-${id}' class="btn btn-danger" ${
    ifChecked ? "" : "disabled"
  } onclick="deleteTableRow(this);">delete</button>`;
  newRow.appendChild(cell1);
  newRow.appendChild(cell2);
  newRow.appendChild(cell3);
  table.appendChild(newRow);
}

// Update table rows
function updateRows(arr, ifChecked) {
  let tableBody = document.getElementById("emailTable");
  tableBody.innerHTML =
    "<thead><th>isEnabled</th><th>Email</th><th>Delete</th></thead>";
  arr.forEach((item, index) => {
    insertRow(item, index + 2, ifChecked);
  });
}

function handleOnCheck(event) {
  console.log("event", event, event.target.checked, event.target.name);
  const name = event.target.name;
  const getId = name.includes("-") && name.split("-")[1];

  console.log("getId", getId);

  const ele = document.getElementById(`btn-${getId}`);
  if (event.target.checked) {
    ele.removeAttribute("disabled");
    disabledUsers.splice(disabledUsers.indexOf(getId), 1);
    enabledUsers.push(parseInt(getId));
  } else {
    enabledUsers.splice(enabledUsers.indexOf(getId), 1);
    disabledUsers.push(parseInt(getId));
    ele.setAttribute("disabled", "");
  }
}

function handleVisibility(event) {
  console.log("enabledUsers", enabledUsers, " disabledUsers", disabledUsers);
  const ele = document.getElementById(`show-checked`);
  const emailList = localStorage.getItem("emailList");
  const arr = fromStrToArr(emailList);

  if (event.target.checked) {
    // Manually adding all users to list

    let newEmailArr = [];
    if (disabledUsers.length == 0) {
      newEmailArr = arr;
    } else {
      enabledUsers.forEach((item, index) => {
        const revertedIndx = item - 2;
        newEmailArr.push(arr[revertedIndx]);
      });
    }

    updateRows(newEmailArr, true);
    ele.setAttribute("checked", "");
  } else {
    let newEmailArr = [];
    disabledUsers.forEach((item, index) => {
      const revertedIndx = item - 2;
      newEmailArr.push(arr[revertedIndx]);
    });
    updateRows(newEmailArr, false);
    ele.removeAttribute("checked", "");
  }
}

// To construct dummy list for email
// if (currentEmailList === null || currentEmailList === "") {
//   const dummyEmailArr = ["dummyuser1@gmail.com", "dummyuser2@gmail.com"];
//   localStorage.setItem("emailList", arrToStr(dummyEmailArr));
// } else {
//   // do not reset
// }
