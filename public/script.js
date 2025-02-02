let isAdmin = false;
let searchedUser = null;

// Load tiers from localStorage or initialize with default data
let tiers = JSON.parse(localStorage.getItem('tiers')) || {
    "ht1": ["Marlowww", "KIRBE", "SharpOrganic985"],
    "lt1": ["rosif", "monkey_bannana"],
    "ht2": ["Dagga", "N1tr0Blade", "zesolution"],
    "lt2": ["Nxrvous", "qMaxy"],
    "ht3": ["GalleryWalk", "Legerije08", "wildinboutnic"],
    "lt3": ["waisilis", "BotZeruto"],
    "ht4": ["Evantii", "Testmaster11", "SalamFromOY"],
    "lt4": ["5cei", "Splashy_2"],
    "ht5": ["down4kgambling", "Org4nic", "shadeBLM"],
    "lt5": ["Dead_Seraph1m", "spoconaSTOPA"]
};

document.getElementById('loginButton').addEventListener('click', adminLogin);
document.getElementById('addButton').addEventListener('click', addNewEntry);
document.getElementById('searchButton').addEventListener('click', searchUser);

function saveTiers() {
    localStorage.setItem('tiers', JSON.stringify(tiers));
}

function renderTiers() {
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`tier${i}Grid`).innerHTML = '';
    }

    for (const [tierKey, names] of Object.entries(tiers)) {
        const tierNumber = tierKey.match(/\d+/)[0];
        const grid = document.getElementById(`tier${tierNumber}Grid`);
        if (grid) {
            names.forEach(name => {
                const nameCard = document.createElement('div');
                nameCard.className = 'name-card';
                nameCard.textContent = name;

                if (isAdmin) {
                    const adminControls = document.createElement('div');
                    adminControls.className = 'admin-controls';
                    adminControls.innerHTML = `
                        <button onclick="deleteUser('${name}')">Delete</button>
                        <button onclick="moveUserPrompt('${name}')">Move</button>
                    `;
                    nameCard.appendChild(adminControls);
                    nameCard.classList.add('admin-logged-in');
                }

                grid.appendChild(nameCard);
            });
        }
    }
}

function adminLogin() {
    const password = prompt('Enter admin password:');
    if (password === 'admin123') {
        isAdmin = true;
        document.getElementById('addForm').style.display = 'block';
        alert('Logged in as admin');
        renderTiers();
    } else {
        alert('Incorrect password');
    }
}

function addNewEntry() {
    if (!isAdmin) {
        alert('Please login as admin');
        return;
    }

    const ign = document.getElementById('ignInput').value.trim();
    const tier = document.getElementById('tierSelect').value;
    const exactTier = document.getElementById('exactTierSelect').value;
    const tierKey = `${exactTier}${tier}`;

    if (!ign) {
        alert('Please enter an IGN');
        return;
    }

    if (!tiers[tierKey]) {
        tiers[tierKey] = [];
    }

    tiers[tierKey].push(ign);
    saveTiers();
    renderTiers();
    document.getElementById('ignInput').value = '';
}

function deleteUser(name) {
    if (!isAdmin) {
        alert('Please login as admin');
        return;
    }

    for (const tierKey in tiers) {
        const index = tiers[tierKey].indexOf(name);
        if (index !== -1) {
            tiers[tierKey].splice(index, 1);
            saveTiers();
            renderTiers();
            return;
        }
    }
}

function moveUserPrompt(name) {
    if (!isAdmin) {
        alert('Please login as admin');
        return;
    }

    const newTier = prompt(`Move ${name} to which tier? (1-5)`);
    const newExactTier = prompt(`Move ${name} to High Tier (HT) or Low Tier (LT)?`).toLowerCase();

    if (newTier && (newExactTier === 'ht' || newExactTier === 'lt')) {
        moveUser(name, newTier, newExactTier);
    } else {
        alert('Invalid input');
    }
}

function moveUser(name, newTier, newExactTier) {
    deleteUser(name); // Remove from current tier
    const newTierKey = `${newExactTier}${newTier}`;
    if (!tiers[newTierKey]) {
        tiers[newTierKey] = [];
    }
    tiers[newTierKey].push(name);
    saveTiers();
    renderTiers();
}

function searchUser() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultDiv = document.getElementById('searchResultContent');
    const actionsDiv = document.getElementById('searchResultActions');
    resultDiv.textContent = '';
    actionsDiv.style.display = 'none';

    for (const [tier, names] of Object.entries(tiers)) {
        if (names.map(n => n.toLowerCase()).includes(searchTerm)) {
            searchedUser = names.find(n => n.toLowerCase() === searchTerm);
            resultDiv.textContent = `User found in ${tier.toUpperCase()}`;

            if (isAdmin) {
                actionsDiv.style.display = 'block';
            }
            return;
        }
    }
    resultDiv.textContent = 'User not found';
}

function deleteSearchedUser() {
    if (!isAdmin) {
        alert('Please login as admin');
        return;
    }

    if (searchedUser) {
        deleteUser(searchedUser);
        searchedUser = null;
        document.getElementById('searchResultContent').textContent = '';
        document.getElementById('searchResultActions').style.display = 'none';
    }
}

function moveSearchedUser() {
    if (!isAdmin) {
        alert('Please login as admin');
        return;
    }

    if (searchedUser) {
        const newTier = prompt(`Move ${searchedUser} to which tier? (1-5)`);
        const newExactTier = prompt(`Move ${searchedUser} to High Tier (HT) or Low Tier (LT)?`).toLowerCase();

        if (newTier && (newExactTier === 'ht' || newExactTier === 'lt')) {
            moveUser(searchedUser, newTier, newExactTier);
            searchedUser = null;
            document.getElementById('searchResultContent').textContent = '';
            document.getElementById('searchResultActions').style.display = 'none';
        } else {
            alert('Invalid input');
        }
    }
}

// Initial render
renderTiers();