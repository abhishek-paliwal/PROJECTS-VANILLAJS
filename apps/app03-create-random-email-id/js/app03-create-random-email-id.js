/*****************************************/
// fetch data from text files on server file ASYNCHRONOUSLY
async function fetchDataFromTextFileUrl(url) {
        try {
            const response = await fetch(`${url}`, {
                method: 'GET',
                credentials: 'same-origin'
            });
            const alldata = await response.text();
            const results = alldata.split('\n') ; 
            return results;
        } catch (error) {
            console.error(error);
        }
    }

/*****************************************/
async function printMultipleRandomEmailIds() {
    let url1 = 'https://www.abhishekpali.us/apps/app03-create-random-email-id/js/list-colors.txt' ;   
    let url2 = 'https://www.abhishekpali.us/apps/app03-create-random-email-id/js/list-species.txt' ;
    //
    const colors = await fetchDataFromTextFileUrl(url1);
    const species = await fetchDataFromTextFileUrl(url2);
    // get random elements from array
    let singleEmailId = [] ; 
    for (i=0 ; i<5; i++) {
        let randomSpecies = species[Math.floor(Math.random()*species.length)];
        let randomColor = colors[Math.floor(Math.random()*colors.length)];
        singleEmailId[i] = '<strong>' + randomColor + '</strong>' + randomSpecies + randomColor.length.toString() + randomSpecies.length.toString() + '@ MYDOMAIN.COM' ; 
        //console.log(randomSpecies);
        //console.log(randomColor);
        //console.log(singleEmailId[i]);
    }
    document.getElementById("finalEmailAddressBlock").innerHTML = singleEmailId.join('<br><br>') ;
}

