async function fetchData() {
    const url = "https://script.google.com/macros/s/AKfycbzBMLJpIS5sMAQyR1CMIH32lDbBKv8Fj-OBboHNSjXNhHcFicKZCZz8zMwbSqJklZ2HDA/exec";  
    try {
        let response = await fetch(url);
        let data = await response.json();  

        function splitUserData() {
            let usersData = [];
            let currentData = [];

            for (let i = 0; i < data.length; i++) {
                if (data[i][0] === "" && data[i][1] === "") continue;
                
                if (data[i][0] === "User" && currentData.length > 0) {
                    usersData.push(currentData);
                    currentData = [];
                }
                
                currentData.push(data[i]);
            }

            if (currentData.length > 0) usersData.push(currentData);

            return usersData;
        }
        
        let result = splitUserData();  
        result.reverse()

        const box = document.querySelector('.box');
        if (box.children.length > 0) {  
            box.innerHTML = '';  
        }
        
        for (let k = 0; k < result.length; k++) {
            const funder = "Funder:"+result[k][0][1]
            const borrower = "Loan Number:"+result[k][1][1]
            const borrowername = "Borrower:"+result[k][2][1]
            const detail = document.createElement('div')
            detail.classList ='inside'
            const  fundp = document.createElement('p');
            const borrowp = document.createElement('p');
            const borrowernamep = document.createElement('p')
            fundp.innerHTML = funder;
            borrowp.innerText = borrower   
            borrowernamep.innerText = borrowernamep

            detail.append(fundp)
            detail.append(borrowp)
            detail.append(borrowername)

            box.append(detail)
        }

        document.getElementById('search').placeholder = ""

        let items = document.querySelectorAll('.inside');
        const modal = document.querySelector('.modal');

        items.forEach(item => {
            item.addEventListener('click', () => {
                modal.style.display = 'flex';
                const current = item.innerText;

                result.forEach(row => {
                    if (current.includes(row[1][1])) {
                        const deets = document.querySelector('.default');

                        const formattedDetails = row.map(item => 
                            `<p><strong>${item[0]}:</strong> ${item[1]}</p>`
                        ).join(""); 

                        deets.innerHTML = formattedDetails;
                    }
                });
            });
        });

        document.addEventListener('click', e=> {
             if(e.target.classList == "modal"){
                e.target.style.display ='none'
             }
        })

        // ✅ SEARCH FUNCTIONALITY
        const search = document.getElementById('search');

search.addEventListener('input', function() {
    const searchText = search.value.toLowerCase();
    const searchTerms = searchText.split(' ').filter(term => term !== '');  // Split search by spaces, ignore empty terms
    const items = document.querySelectorAll('.inside');

    items.forEach(item => {
        const itemText = item.innerText.toLowerCase();
        
        // Check if all search terms are found in the item text
        const matches = searchTerms.every(term => itemText.includes(term));

        if (matches) {
            item.style.display = 'block'; // Show matching items
        } else {
            item.style.display = 'none';  // Hide non-matching items
        }
    });
});

    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("output").innerText = "Failed to fetch data.";
    }
}
