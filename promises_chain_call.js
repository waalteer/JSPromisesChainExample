// Demo setup
var threshold = 5; // Editable, quantity of items on each payload batch
var numItems = 23; // Editable, number of items in the data array
var callLimit = 3; // Toggle number to whatever call you want to force to error


// Core code
var data = getData();
var dataSize = data.length;
var calls = 0;

var promiseChain = batchProcess(data.splice(0, Math.min(threshold, data.length)), calls++);

if (dataSize > threshold) {
    for (var i = threshold; i < dataSize; i += threshold) {
        promiseChain = promiseChain.then(batchCallback);
    }
}
promiseChain.then(handleFinalResponse)
    .catch(handleError);


// Helper functions
function batchProcess(data, callCount) {
    // Simulation of AJAX call here, returning a promise to be resolved in 1s
    // When the arbitrary limit of calls is reached it will reject the subsequent call
    console.log("Call to batchProcess #" + callCount + " with " + data.length + " elements");
    if (callCount < callLimit) {
        return(new Promise(function(resolve, reject) {
            setTimeout(function() {
                console.info('Returning a sucessful call');
                resolve('success');}, 1000);
        }));
    } else {
        return(new Promise(function(resolve, reject) {
            setTimeout(function() {
                console.info('Returning a rejected call');
                reject('rejected');}, 1000);
        }));
    }
}

function batchCallback(res) {
    // Callback function that will chain the next 'AJAX' call with a subset
    // of the remaining items in the data set
    if (res == "success") {
        var len =  Math.min(threshold, data.length);
        return batchProcess(data.splice(0, len), calls++);
    } else {
        console.error('Error in response. ' + data.length + " items left");
    }
}

function handleFinalResponse(response) {
    // Last method to be called when all promises have been resolved successfully
    if (response == 'success') {
        console.log('Successfull call');
    } else {
        console.error('Error in response');
    }
}

function handleError(err) {
    // Function to catch any error received from the chain of promises
    console.error('[ERROR]: ' + err);
}

function getData() {
    // Simulated function to generate and return an array of items, numbers in this case
    var items = [];
    for (var i = 0; i < numItems; i++) {
        items.push(i);
    }
    return items;
}
