// Client Side JavaScript for the continent and region select dropdowns

document.addEventListener('DOMContentLoaded', function() {
    const continentSelect = document.getElementById('continentSelect');
    const regionSelect = document.getElementById('regionSelect');

    // Fetch the list of continents and populate the dropdown
    fetch('/continents').then(response => response.json()).then(data => {
        data.forEach(continent => {
            const option = new Option(continent, continent);
            continentSelect.add(option);
        });
    });

    // Fetch the list of regions based on the selected continent and populate the dropdown
    continentSelect.addEventListener('change', function() {
        const continent = this.value;
        regionSelect.innerHTML = '<option value="">Select Region</option>'; // Reset

        if (!continent) return;

        // Fetch the regions based on the selected continent
        fetch(`/regions/${continent}`).then(response => response.json()).then(data => {
            data.forEach(region => {
                const option = new Option(region, region);
                regionSelect.add(option);
            });
        });
    });
});



