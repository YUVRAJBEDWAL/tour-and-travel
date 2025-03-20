document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    const searchForms = document.querySelectorAll('.search-form');
    searchForms.forEach(form => {
        form.addEventListener('submit', handleSearch);
    });

    // Handle search form submission
    async function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchData = Object.fromEntries(formData);
        
        try {
            const response = await fetch('http://localhost:3001/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchData)
            });
            
            const results = await response.json();
            displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed. Please try again.');
        }
    }

    // Display search results
    function displaySearchResults(results) {
        // Implement search results display logic
        console.log('Search results:', results);
    }
});