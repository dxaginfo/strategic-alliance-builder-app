/**
 * Strategic Alliance Builder - Main Application Script
 * 
 * This file contains the core functionality of the Strategic Alliance Builder application,
 * including navigation, data management, and shared utilities.
 */

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Strategic Alliance Builder - Application Initialized');
    
    // Initialize UI components
    initializeNavigation();
    setupEventListeners();
    
    // Load any saved data from local storage
    loadAppData();
});

/**
 * Initialize the navigation system
 */
function initializeNavigation() {
    // Get all nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Add click event listeners to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href').replace('#', '');
            
            // Show the target section
            showSection(targetId);
        });
    });
}

/**
 * Show a specific section and hide others
 * @param {string} sectionId - The ID of the section to display
 */
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id) {
            section.classList.add('d-none');
        }
    });
    
    // Show the target section
    if (sectionId && sectionId !== '') {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('d-none');
            
            // Scroll to the top of the section
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    }
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Range input value display for alignment score
    const alignmentScoreSlider = document.getElementById('minAlignmentScore');
    const alignmentScoreValue = document.getElementById('alignmentScoreValue');
    
    if (alignmentScoreSlider && alignmentScoreValue) {
        alignmentScoreSlider.addEventListener('input', function() {
            alignmentScoreValue.textContent = this.value;
        });
    }
    
    // Form submissions
    setupFormSubmissions();
}

/**
 * Set up event listeners for form submissions
 */
function setupFormSubmissions() {
    // Brand profile form
    const brandProfileForm = document.getElementById('brandProfileForm');
    if (brandProfileForm) {
        brandProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveBrandProfile();
        });
    }
    
    // Organization profile form
    const orgProfileForm = document.getElementById('orgProfileForm');
    if (orgProfileForm) {
        orgProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveOrgProfile();
        });
    }
    
    // Match form
    const matchForm = document.getElementById('matchForm');
    if (matchForm) {
        matchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            findMatches();
        });
    }
    
    // ROI calculator form
    const roiForm = document.getElementById('roiForm');
    if (roiForm) {
        roiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateROI();
        });
    }
}

/**
 * Save a brand profile to local storage
 */
function saveBrandProfile() {
    // Get form values
    const name = document.getElementById('brandName').value;
    const industry = document.getElementById('brandIndustry').value;
    const description = document.getElementById('brandDescription').value;
    const values = document.getElementById('brandValues').value.split(',').map(v => v.trim());
    const audienceAge = document.getElementById('audienceAge').value;
    const audienceRegion = document.getElementById('audienceRegion').value;
    
    // Get selected partnership goals
    const goalsSelect = document.getElementById('partnershipGoals');
    const goals = Array.from(goalsSelect.selectedOptions).map(option => option.value);
    
    // Create profile object
    const profile = {
        id: 'brand_' + Date.now(),
        type: 'brand',
        name,
        industry,
        description,
        values,
        audience: {
            age: audienceAge,
            region: audienceRegion
        },
        goals
    };
    
    // Save to local storage
    saveProfileToStorage(profile);
    
    // Show success message
    alert('Brand profile saved successfully!');
    
    // Reset form
    document.getElementById('brandProfileForm').reset();
}

/**
 * Save an organization profile to local storage
 */
function saveOrgProfile() {
    // Get form values
    const name = document.getElementById('orgName').value;
    const type = document.getElementById('orgType').value;
    const description = document.getElementById('orgDescription').value;
    const values = document.getElementById('orgValues').value.split(',').map(v => v.trim());
    const audienceSize = document.getElementById('orgAudienceSize').value;
    const region = document.getElementById('orgRegion').value;
    
    // Get selected partnership types
    const typesSelect = document.getElementById('partnershipTypes');
    const partnershipTypes = Array.from(typesSelect.selectedOptions).map(option => option.value);
    
    // Create profile object
    const profile = {
        id: 'org_' + Date.now(),
        type: 'organization',
        name,
        orgType: type,
        description,
        values,
        audience: {
            size: audienceSize,
            region
        },
        partnershipTypes
    };
    
    // Save to local storage
    saveProfileToStorage(profile);
    
    // Show success message
    alert('Organization profile saved successfully!');
    
    // Reset form
    document.getElementById('orgProfileForm').reset();
}

/**
 * Save a profile to local storage
 * @param {object} profile - The profile object to save
 */
function saveProfileToStorage(profile) {
    // Get existing profiles from storage
    let profiles = getProfilesFromStorage();
    
    // Add new profile
    profiles.push(profile);
    
    // Save back to storage
    localStorage.setItem('strategicAllianceProfiles', JSON.stringify(profiles));
    
    // Update profile selectors
    updateProfileSelectors();
}

/**
 * Get profiles from local storage
 * @returns {Array} Array of profile objects
 */
function getProfilesFromStorage() {
    const profilesJson = localStorage.getItem('strategicAllianceProfiles');
    return profilesJson ? JSON.parse(profilesJson) : [];
}

/**
 * Update profile selectors in the UI
 */
function updateProfileSelectors() {
    const profiles = getProfilesFromStorage();
    const matchProfileSelect = document.getElementById('matchProfile');
    
    if (matchProfileSelect) {
        // Clear existing options (except the default)
        while (matchProfileSelect.options.length > 1) {
            matchProfileSelect.remove(1);
        }
        
        // Add options for each profile
        profiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile.id;
            option.textContent = `${profile.name} (${profile.type})`;
            matchProfileSelect.appendChild(option);
        });
    }
}

/**
 * Load all application data from local storage
 */
function loadAppData() {
    // Update profile selectors
    updateProfileSelectors();
}

/**
 * Find potential matching partners
 */
function findMatches() {
    // This will be implemented in matcher.js
    console.log('Finding matches...');
}

/**
 * Calculate partnership ROI
 */
function calculateROI() {
    // This will be implemented in calculator.js
    console.log('Calculating ROI...');
}

/**
 * Utility function to generate a unique ID
 * @returns {string} A unique ID
 */
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Format currency values
 * @param {number} value - The value to format as currency
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

/**
 * Export data to a JSON file
 * @param {object} data - The data to export
 * @param {string} fileName - The name of the file to save
 */
function exportToJson(data, fileName) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', fileName);
    exportLink.click();
}

/**
 * Import data from a JSON file
 * @param {Function} callback - Function to call with the imported data
 */
function importFromJson(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.addEventListener('change', function() {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.addEventListener('load', function() {
                try {
                    const data = JSON.parse(reader.result);
                    callback(data);
                } catch (error) {
                    alert('Error parsing JSON file: ' + error.message);
                }
            });
            
            reader.readAsText(file);
        }
    });
    
    input.click();
}