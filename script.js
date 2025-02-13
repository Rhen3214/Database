async function fetchData() {
    const url = "https://script.google.com/macros/s/AKfycbzBMLJpIS5sMAQyR1CMIH32lDbBKv8Fj-OBboHNSjXNhHcFicKZCZz8zMwbSqJklZ2HDA/exec";  
    const loader = document.querySelector('.loader');
    const box = document.querySelector('.box');

    try {
        loader.style.display = 'block'; // Show loader before fetching data

        // Stream large data
        let response = await fetch(url);
        let reader = response.body.getReader();
        let decoder = new TextDecoder();
        let result = '';
        let { value, done } = await reader.read();

        while (!done) {
            result += decoder.decode(value, { stream: true });
            ({ value, done } = await reader.read());
        }

        let data = JSON.parse(result);
        console.log(data);

        // ✅ Non-mutating reverse function
        function getReversedUserData() {
            return data.reduce((usersData, row) => {
                if (row[0] === "User") usersData.push([]);
                if (usersData.length > 0) usersData[usersData.length - 1].push(row);
                return usersData;
            }, []).slice().reverse(); // Reverse without mutating
        }

        let usersData = getReversedUserData();

        // ✅ Use Document Fragment to reduce DOM reflows
        const fragment = document.createDocumentFragment();

        usersData.forEach(user => {
            const funder = `Funder: ${user[0][1]}`;
            const borrower = `Loan Number: ${user[1][1]}`;
            const borrowername = `Borrower: ${user[2][1]}`;

            const detail = document.createElement('div');
            detail.classList.add('inside');

            const detaildiv = document.createElement('div');
            detaildiv.classList.add('diva');

            detaildiv.innerHTML = `
                <p>${funder}</p>
                <p>${borrower}</p>
                <p>${borrowername}</p>
            `;

            detail.appendChild(detaildiv);

            // ✅ Check for Warehouse Amount
            const hasRecon = user.some(row => row[0] === "Warehouse Amount");
            const reconDiv = document.createElement('div');
            reconDiv.classList.add('rvil');
            reconDiv.innerHTML = `
                <p style="background-color: ${hasRecon ? '#41b541' : '#e0515f'}; border-radius: 8px;">
                    ${hasRecon ? 'Recon Available' : 'No Recon'}
                </p>
            `;

            detail.appendChild(reconDiv);
            fragment.appendChild(detail);

            // ✅ Attach user data to the element for modal retrieval
            detail.dataset.userIndex = usersData.indexOf(user);
        });

        box.innerHTML = '';  // Clear previous content
        box.appendChild(fragment);

        document.getElementById('search').placeholder = "";

        // ✅ Modal Event Listener (Fix)
        document.querySelectorAll('.inside').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelector('.modal').style.display = 'flex';
                const userIndex = item.dataset.userIndex;
                const user = usersData[userIndex];

                if (user) {
                    document.querySelector('.default').innerHTML = user.map(item => 
                        `<p><strong>${item[0]}:</strong> ${item[1]}</p>`).join(""); 
                }
            });
        });

        // ✅ Close Modal on Click Outside
        document.addEventListener('click', e => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // ✅ Optimized Search Function with Debounce
        function debounce(func, delay) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), delay);
            };
        }

        const search = document.getElementById('search');
        search.addEventListener('input', debounce(() => {
            const searchText = search.value.toLowerCase();
            document.querySelectorAll('.inside').forEach(item => {
                item.style.display = item.innerText.toLowerCase().includes(searchText) ? 'block' : 'none';
            });
        }, 300)); // 300ms debounce delay

    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("output").innerText = "Failed to fetch data.";
    } finally {
        loader.style.display = 'none'; // Hide loader after fetching
    }
}
