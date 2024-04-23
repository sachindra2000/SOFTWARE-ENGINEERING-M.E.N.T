document.addEventListener('DOMContentLoaded', function() {
    const continentSelect = document.getElementById('continentSelect');
    const regionSelect = document.getElementById('regionSelect');
    const countrySelect = document.getElementById('countrySelect');
    const districtSelect = document.getElementById('districtSelect');

    // Initialize dropdowns
    initializeDropdowns();

    // Reset and initialize all dropdowns
    function initializeDropdowns() {
        fetchDropdownData('/continents', continentSelect, 'Continent');
        fetchDropdownData('/regions', regionSelect, 'Region');
        fetchDropdownData('/country_route', countrySelect, 'Country');
        fetchDropdownData('/districts', districtSelect, 'District');
    }

    // General function to fetch data and populate dropdown
    function fetchDropdownData(url, dropdown, placeholder) {
        fetch(url).then(response => response.json()).then(data => {
            dropdown.innerHTML = `<option value=''>Select ${placeholder}</option>`;
            data.forEach(item => {
                const option = new Option(item, item);
                dropdown.add(option);
            });
        });
    }

    // Event listeners for dropdown changes
    continentSelect.addEventListener('change', function() {
        if(this.value) {
            resetDropdowns(regionSelect, countrySelect, districtSelect);
        }
    });

    regionSelect.addEventListener('change', function() {
        if(this.value) {
            resetDropdowns(continentSelect, countrySelect, districtSelect);
        }
    });

    countrySelect.addEventListener('change', function() {
        if(this.value) {
            resetDropdowns(continentSelect, regionSelect, districtSelect);
        }
    });

    districtSelect.addEventListener('change', function() {
        if(this.value) {
            resetDropdowns(continentSelect, regionSelect, countrySelect);
        }
    });

    // Function to reset other dropdowns
    function resetDropdowns(...dropdowns) {
        dropdowns.forEach(dropdown => {
            dropdown.selectedIndex = 0; // Reset to the first item
        });
    }
});
