// Load existing customers from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
  loadCustomers();
});

// Add customers
let Customer_location = document.getElementById("accordion");
console.log(Customer_location);
add_customers_btn = document.getElementById("add-customers-btn");
customer_popup = document.getElementById("customer-popup");

getValue = () => {
  name_value = document.getElementById("cst-name").value;
  if(name_value.length<=0){
    alert("Please enter a valid value")
  }
  else{
    customer_html = `
  <div class="accordion-content-box">
    <div class="accordion-label">
       ${name_value}
    </div>
    <div class="accordion-content">
      <div class="enteries-header">
        <div class="date">
          Date
        </div>
        <div class="you-got">
          YOU GOT
        </div>
        <div class="you-gave">
          YOU GAVE
        </div>
      </div>
    </div>
  </div>`;
  $(Customer_location).append(customer_html);
  saveCustomers();
  }
  
  // saveCustomers();
  $(customer_popup).hide();
};

$(add_customers_btn).click(function () {
  $(customer_popup).hide();
  customer_popup.style.display = "flex";
  $(customer_popup).show();
});

// Accordion event delegation
$(Customer_location).on("click", ".accordion-content-box", function () {
  console.log(this);
  $(this).toggleClass("active-accordion");
});

// Save customers to localStorage
function saveCustomers() {
  const existingCustomers = JSON.parse(localStorage.getItem("customers")) || [];
  const nameValue = document.getElementById("cst-name").value;

  existingCustomers.push(nameValue);

  localStorage.setItem("customers", JSON.stringify(existingCustomers));
}

// Load customers from localStorage
function loadCustomers() {
  const existingCustomers = JSON.parse(localStorage.getItem("customers")) || [];

  existingCustomers.forEach((nameValue) => {
    const customer_html = `
    <div class="accordion-content-box">
      <div class="accordion-label">
        3. ${nameValue}
      </div>
      <div class="accordion-content">
        <div class="enteries-header">
          <div class="date">
            Date
          </div>
          <div class="you-got">
            YOU GOT
          </div>
          <div class="you-gave">
            YOU GAVE
          </div>
        </div>
      </div>
    </div>`;
    $(Customer_location).append(customer_html);
  });
}

//switch section
function getTarget(){

  const queryString = this.getAttribute("href"); 
  console.log(queryString)
  target =  queryString.split("#")[1]
  console.log(target) 
  if(target){
  const paddingElements = document.getElementsByClassName("right-side");
 
  for (let i = 0; i < paddingElements.length; i++) {
    console.log(paddingElements[i])
    paddingElements[i].style.display = "none";
  }
 
  const targetElement = document.getElementById(target);
  console.log(targetElement)
  if (targetElement) {
    console.log(targetElement)
    targetElement.style.display = "block";
    console.log(targetElement)

  }

  const leftMenu = document.getElementsByClassName("tab-bar-heading");
  console.log(leftMenu[0].childNodes.length);
  for (let i = 0; i < leftMenu.length; i++) {
    if(leftMenu[i].classList.contains("selected-section")){
      leftMenu[i].classList.remove("selected-section")
    }
    if(leftMenu[i].hash==queryString){
      leftMenu[i].classList.add("selected-section");
    }
  }
}else{
  const paddingElements = document.getElementsByClassName("right-side");
  for (let i = 1; i < paddingElements.length; i++) {
    paddingElements[i].style.display = "none";
  }
}
}

$(document).ready(function () {
  const tabBarHeadings = document.querySelectorAll(".tab-bar-heading");
tabBarHeadings.forEach(function (tabBarHeading) {
  tabBarHeading.addEventListener("click", getTarget);
});

})