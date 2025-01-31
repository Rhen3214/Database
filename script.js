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

        const box = document.querySelector('.box');
        if (box.children.length > 0) {  
            box.innerHTML = '';  
        }
        
        for (let k = 0; k < result.length; k++) {
            const inside = result[k][0];
            const inside2 = result[k][1]
            const inside3 = result[k][3]
            const inside4 = result[k][4]

            const full = [...inside,...inside2,...inside3,...inside4]
            const loan = document.createElement('p');
            loan.innerText = (full);
            loan.classList.add('inside');
            
            box.append(loan);
        }

        

        let items = document.querySelectorAll('p');
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

        modal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

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
