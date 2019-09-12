var myDeveloper = {};
var statusMessage = "Welcome";


function CalculateConduction(length, area, source, sink, thermalConductivity) {
    var conductionLoss = thermalConductivity * area * (source - sink) / (3.412 * length);
    if (isNaN(conductionLoss)) {
        return 0;
    } else {
        return conductionLoss;
    }
}

$('#addDeveloperModal').on('show.bs.modal', function (event) {
    //    LoadDataObjects();
    //    var button = $(event.relatedTarget) // Button that triggered the modal
    //    var myIndex = button.data('hc-index') // Extract info from data-* attributes
    //    var modal = $(this)
    //    //
    //    modal.find('.modal-title').text('Conduction parameters');
    //    for (var i = 0; i < heatTransferElements.length; i++) {
    //        if (heatTransferElements[i].timestamp === myIndex) {
    //            
    //            //update title and description fields
    //            modal.find('.modal-body input.hc-conduction-title').val(heatTransferElements[i].title);
    //            modal.find('.modal-body textarea.hc-conduction-description').val(heatTransferElements[i].description);
    //            
    //            //parse data from data variable in put in appropiate fields
    //            var mySeparator = String.fromCharCode(30);
    //            var myStrings = heatTransferElements[i].data.split(mySeparator) 
    //            modal.find('.modal-body input.hc-conduction-length').val(myStrings[0]);
    //            modal.find('.modal-body input.hc-conduction-area').val(myStrings[1]);
    //            modal.find('.modal-body input.hc-conduction-source').val(myStrings[2]);
    //            modal.find('.modal-body input.hc-conduction-sink').val(myStrings[3]);
    //            modal.find('.modal-body input.hc-conduction-thermalConductivity').val(myStrings[4]);
    //            
    //            //embed timestamp into my-conduction-data-div element for later use
    //            var mylistHTML = `<div class = "my-conduction-data-div" id = "my-conduction-data-div" data-my-timestamp="`+ myIndex +`"></div>`;
    //            modal.find('.modal-body div.my-conduction-data-div').html(mylistHTML);
    //                
    //            //create dropdown for material selection
    //            var mylistHTML = `<div class = "row hc-conduction-material-div">`;
    //            mylistHTML += `<p>Select Material or select None to enter your own conductivity</p>`
    //            mylistHTML += `<p><select class = "select-hc-conduction-material" id="select-hc-conduction-material" onchange="conductionDropDownChanged()"></p>`;
    //            mylistHTML += `<option value = "-1">None</option>`;
    //            for ( var j = 0; j < materials.length; j++) {
    //                mylistHTML += `<option value = "`+j+`">` + materials[j].name + `</option>`;
    //            }  
    //            mylistHTML += `</select>`;
    //            mylistHTML += `</div>`;
    //            modal.find('.modal-body div.hc-conduction-material').html(mylistHTML); 
    //            modal.find('.modal-body select.select-hc-conduction-material').val(myStrings[5]);
    //            break;
    //        }
    //    }
})

function conductionDropDownChanged() {
    var myIndex = (document.getElementById('select-hc-conduction-material').value);
    console.log("User changed material option to " + myIndex + " in conduction modal");
    if (myIndex == -1) {
        document.getElementById('hc-conduction-thermalConductivity').value = "";
    } else {
        document.getElementById('hc-conduction-thermalConductivity').value = materials[myIndex].thermalConductivity;
    }
}

function closeAddDeveloperModal() {
    var email = document.getElementById('developer-email').value;
    var password = document.getElementById('developer-password').value;
    var firstName = document.getElementById('developer-first-name').value;
    var lastName = document.getElementById('developer-last-name').value;
    var bio = document.getElementById('developer-bio').value;
    var role = 'admin' // TODO document.getElementById('developer-role').value;
    
    fetch('/developer', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                bio: bio,
                role: role
            })
        }).then(res => res.json())
        .then(res => console.log(res))
}