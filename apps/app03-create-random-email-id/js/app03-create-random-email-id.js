/*****************************************/
// read file ASYNCHRONOUSLY
function readAllFiles() {
    fetch('./js/list-species.txt')
        .then(response => response.text())
        .then(text => console.log(text))
}

