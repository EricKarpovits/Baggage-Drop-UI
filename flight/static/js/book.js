document.addEventListener('DOMContentLoaded', () => {
    flight_duration();
    document.querySelectorAll(".carrier").forEach((element) => element.addEventListener("click",(e) => selectCarrier(e)));
    addBaggageClickEvents();
    formatCurrency();
});

function formatCurrency(){
    document.querySelectorAll(".currency").forEach((element) => {
        if (!isNaN(element.innerText)){
            element.innerText = parseFloat(element.innerText).toFixed(2);
        }
    });
}

function flight_duration() {
    document.querySelectorAll(".duration").forEach(element => {
        let time = element.dataset.value.split(":");
        element.innerText = time[0]+"h "+time[1]+"m";
    });
}
function selectCarrier(event) {
    const carrier = event.target.getAttribute("data-carrier");
    document.querySelectorAll(".carrier").forEach((element) => element.classList.remove("selected"));
    document.querySelectorAll("[data-carrier='" + carrier + "']").forEach((element) => element.classList.add("selected"));
    updatePrices();
}

function updatePrices(){
    let baggageDropFee = 0.00;
    document.querySelectorAll(".baggageCounter").forEach((element) => {
        const numberOfBags = parseInt(element.querySelector(".num").innerText);
        const costElement = element.querySelector(".carrier.selected span");
        const costPerBag = costElement ? costElement.innerText : 0.00;
        baggageDropFee += costPerBag * numberOfBags;
    });
    document.querySelector(".baggage-drop-value > span").innerText = baggageDropFee.toFixed(2);
    const baseFareValue = parseFloat(document.querySelector(".base-fare-value span").innerText);
    const feesSurcharge = parseFloat(document.querySelector(".surcharges-value span").innerText);
    document.querySelector(".total-fare-value span").innerText = (baggageDropFee + baseFareValue + feesSurcharge).toFixed(2);
}

function addBaggageClickEvents() {
    document.querySelectorAll(".baggageCounter").forEach((element) => {
        let counter = 0;
        let num = element.querySelector(".num");
        element.querySelector(".plus").addEventListener("click",()=>{
            counter++;
            num.innerText = counter;
            updatePrices();
        });
        element.querySelector(".minus").addEventListener("click", ()=>{
            if(counter > 0){
                counter--;
                num.innerText = counter;
                updatePrices();
            }
        });  
    });                                 
}

function add_traveller() {
    let div = document.querySelector('.add-traveller-div');
    let fname = div.querySelector('#fname');
    let lname = div.querySelector('#lname');
    let gender = div.querySelectorAll('.gender');
    let gender_val = null
    if(fname.value.trim().length === 0) {
        alert("Please enter First Name.");
        return false;
    }

    if(lname.value.trim().length === 0) {
        alert("Please enter Last Name.");
        return false;
    }

    if (!gender[0].checked) {
        if (!gender[1].checked) {
            alert("Please select gender.");
            return false;
        }
        else {
            gender_val = gender[1].value;
        }
    }
    else {
        gender_val = gender[0].value;
    }

    let passengerCount = div.parentElement.querySelectorAll(".each-traveller-div .each-traveller").length;

    let traveller = `<div class="row each-traveller">
                        <div>
                            <span class="traveller-name">${fname.value} ${lname.value}</span><span>,</span>
                            <span class="traveller-gender">${gender_val.toUpperCase()}</span>
                        </div>
                        <input type="hidden" name="passenger${passengerCount+1}FName" value="${fname.value}">
                        <input type="hidden" name="passenger${passengerCount+1}LName" value="${lname.value}">
                        <input type="hidden" name="passenger${passengerCount+1}Gender" value="${gender_val}">
                        <div class="delete-traveller">
                            <button class="btn" type="button" onclick="del_traveller(this)">
                                <svg width="1.1em" height="1.1em" viewBox="0 0 16 16" class="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>
                        </div>
                    </div>`;
    div.parentElement.querySelector(".each-traveller-div").innerHTML += traveller;
    div.parentElement.querySelector("#p-count").value = passengerCount+1;
    div.parentElement.querySelector(".traveller-head h6 span").innerText = passengerCount+1;
    div.parentElement.querySelector(".no-traveller").style.display = 'none';
    fname.value = "";
    lname.value = "";
    gender.forEach(radio => {
        radio.checked = false;
    });

    let pcount = document.querySelector("#p-count").value;
    let fare = document.querySelector("#basefare").value;
    let fee = document.querySelector("#fee").value;
    
    if (parseInt(pcount)!==0) {
        document.querySelector(".base-fare-value span").innerText = parseInt(fare)*parseInt(pcount);
        document.querySelector(".total-fare-value span").innerText = (parseInt(fare)*parseInt(pcount))+parseInt(fee)
    }

}

function del_traveller(btn) {
    let traveller = btn.parentElement.parentElement;
    let tvl = btn.parentElement.parentElement.parentElement.parentElement;
    let cnt = tvl.querySelector("#p-count");
    cnt.value = parseInt(cnt.value)-1;
    tvl.querySelector(".traveller-head h6 span").innerText = cnt.value;
    if(parseInt(cnt.value) <= 0) {
        tvl.querySelector('.no-traveller').style.display = 'block';
    }
    traveller.remove();
    
    let pcount = document.querySelector("#p-count").value;
    let fare = document.querySelector("#basefare").value;
    let fee = document.querySelector("#fee").value;
    let baggageFee = 100;

    if (parseInt(pcount) !== 0) {
        document.querySelector(".base-fare-value span").innerText = parseInt(fare)*parseInt(pcount);
        document.querySelector(".total-fare-value span").innerText = (parseInt(fare)*parseInt(pcount))+parseInt(fee)+parseInt(baggageFee);
           
    }
}

function book_submit() {
    let pcount = document.querySelector("#p-count");
    if(parseInt(pcount.value) > 0) {
        return true;
    }
    alert("Please add atleast one passenger.")
    return false;
}