function DisplayElements(heatTransferElements) { // DisplayElements takes in an array of sticky note objects and displays them as bootstrap card elements.
    var totalWatts = 0;
    var myResultInstance = 0;
    let listHTML = `<div class ="row" style = "padding-top:0rem; padding-bottom:7rem;">`;
    for (let i = 0; i < heatTransferElements.length; i++) {
        let myheatTransferElements = heatTransferElements[i];
        heatTransferElements[i].result
        listHTML += `<div class ="col test-case-card">`;
        listHTML += `<div class="card jims-card">`;
        listHTML += `<img class="card-img-top" src="/assets/`+ myheatTransferElements.type +`-cartoon.jpg" alt="Card image cap">`;
        listHTML += `<div class="card-body">`;
        
        switch(myheatTransferElements.type) {
          case 'conduction':
            listHTML += `<h5 class="card-title">Conduction: `+ myheatTransferElements.title + `</h5>`;
            break;
          case 'radiation':
            listHTML += `<h5 class="card-title">Radiation: `+ myheatTransferElements.title + `</h5>`;
            break;
          case 'convection':
            listHTML += `<h5 class="card-title">Convection: `+ myheatTransferElements.title + `</h5>`;
            break;
        case 'heatup':
            listHTML += `<h5 class="card-title">Heat up: `+ myheatTransferElements.title + `</h5>`;
            break;
        case 'processload':
            listHTML += `<h5 class="card-title">Process load: `+ myheatTransferElements.title + `</h5>`;
            break;
        }
       
        myResultInstance = parseFloat(myheatTransferElements.result);
        totalWatts += myResultInstance;
        listHTML += `<p class="card-text">Watts lost: `+ myResultInstance.toFixed(1); + `</p>`;
        listHTML += `<div class ="row">`
        switch(myheatTransferElements.type) {
          case 'conduction':
            listHTML += `<button type="button" class="btn btn-primary addItemButton" data-toggle="modal" data-target="#conductionModal" data-hc-index="` + myheatTransferElements.timestamp + `"> Edit inputs </button>`;
            break;
          case 'radiation':
            listHTML += `<button type="button" class="btn btn-primary addItemButton" data-toggle="modal" data-target="#radiationModal" data-hc-index="` + myheatTransferElements.timestamp + `"> Edit inputs </button>`;
            break;
          case 'convection':
            listHTML += `<button type="button" class="btn btn-primary addItemButton" data-toggle="modal" data-target="#convectionModal" data-hc-index="` + myheatTransferElements.timestamp + `"> Edit inputs </button>`;
            break;
        case 'heatup':
            listHTML += `<button type="button" class="btn btn-primary addItemButton" data-toggle="modal" data-target="#heatupModal" data-hc-index="` + myheatTransferElements.timestamp + `"> Edit inputs </button>`;
            break;
        case 'processload':
            listHTML += `<button type="button" class="btn btn-primary addItemButton" data-toggle="modal" data-target="#processloadModal" data-hc-index="` + myheatTransferElements.timestamp + `"> Edit inputs </button>`;
            break;
        }
        listHTML += `<button type="button" class="btn btn-primary addItemButton" onclick ="DeleteHeatTransferElement(` + myheatTransferElements.timestamp + `)">Delete</button>`;
        listHTML += `</div>`;
        listHTML += `</div>`;
        listHTML += `</div>`;
        listHTML += `</div>`;
    }
    listHTML += `</div>`;
    
    document.getElementById('heat-transfer-elements').innerHTML = listHTML;
    
    document.getElementById('total-watts-lost').innerHTML = `<p> Total Watts Lost: `+ totalWatts.toFixed(1) + `</p>`;
}