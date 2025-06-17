/**
 * Strategic Alliance Builder - Profile Management
 * 
 * This file contains the functionality for managing organization and brand profiles,
 * including creating, editing, and managing profile data.
 */

// Sample profiles for demonstration purposes
const SAMPLE_PROFILES = [
    {
        id: 'brand_1',
        type: 'brand',
        name: 'TechInnovate',
        industry: 'technology',
        description: 'A leading technology company specializing in innovative consumer electronics and software solutions.',
        values: ['Innovation', 'Quality', 'Customer Focus'],
        audience: {
            age: '25-34',
            region: 'north_america'
        },
        goals: ['brand_awareness', 'product_innovation', 'audience_reach']
    },
    {
        id: 'org_1',
        type: 'organization',
        name: 'Global Sports League',
        orgType: 'sports_team',
        description: 'Professional sports league with teams and events across multiple countries.',
        values: ['Excellence', 'Teamwork', 'Community'],
        audience: {
            size: '500k-1m',
            region: 'global'
        },
        partnershipTypes: ['naming_rights', 'content_creation', 'experiential']
    },
    {
        id: 'brand_2',
        type: 'brand',
        name: 'HealthFirst',
        industry: 'healthcare',
        description: 'Healthcare provider offering comprehensive health services and wellness programs.',
        values: ['Care', 'Integrity', 'Innovation'],
        audience: {
            age: '35-44',
            region: 'north_america'
        },
        goals: ['brand_awareness', 'social_impact']
    },
    {
        id: 'org_2',
        type: 'organization',
        name: 'Education Forward',
        orgType: 'education',
        description: 'Nonprofit organization focused on advancing educational opportunities for underserved communities.',
        values: ['Equality', 'Education', 'Empowerment'],
        audience: {
            size: '100k-500k',
            region: 'north_america'
        },
        partnershipTypes: ['cause_marketing', 'content_creation']
    }
];

/**
 * Initialize profile management functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize profiles if none exist
    initializeProfiles();
    
    // Set up profile form event listeners
    setupProfileForms();
});

/**
 * Initialize profiles with sample data if none exist
 */
function initializeProfiles() {
    // Check if profiles exist in local storage
    const profiles = getProfilesFromStorage();
    
    // If no profiles exist, add sample profiles
    if (profiles.length === 0) {
        localStorage.setItem('strategicAllianceProfiles', JSON.stringify(SAMPLE_PROFILES));
        console.log('Initialized with sample profiles');
    }
}

/**
 * Set up profile form functionality
 */
function setupProfileForms() {
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
    
    // Add value tag input functionality
    setupTagInputs();
}

/**
 * Set up tag input functionality for values and other tag fields
 */
function setupTagInputs() {
    const tagInputs = document.querySelectorAll('input[placeholder*="separated by commas"]');
    
    tagInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            // Add tag when comma or enter is pressed
            if (e.key === ',' || e.key === 'Enter') {
                e.preventDefault();
                
                const value = this.value.trim();
                if (value) {
                    // In a full implementation, we would add a visual tag here
                    // and clear the input field
                    console.log('Tag added:', value);
                }
            }
        });
    });
}

/**
 * Load a profile into a form for editing
 * @param {string} profileId - ID of the profile to load
 */
function loadProfileForEdit(profileId) {
    const profiles = getProfilesFromStorage();
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) {
        console.error('Profile not found:', profileId);
        return;
    }
    
    // Show the profiles section
    showSection('profiles');
    
    // Select the appropriate tab based on profile type
    if (profile.type === 'brand') {
        document.getElementById('brand-tab').click();
        
        // Populate form fields
        document.getElementById('brandName').value = profile.name;
        document.getElementById('brandIndustry').value = profile.industry;
        document.getElementById('brandDescription').value = profile.description;
        document.getElementById('brandValues').value = profile.values.join(', ');
        
        if (profile.audience) {
            document.getElementById('audienceAge').value = profile.audience.age || '';
            document.getElementById('audienceRegion').value = profile.audience.region || '';
        }
        
        // Handle multi-select for goals
        const goalsSelect = document.getElementById('partnershipGoals');
        if (goalsSelect) {
            Array.from(goalsSelect.options).forEach(option => {
                option.selected = profile.goals && profile.goals.includes(option.value);
            });
        }
    } else if (profile.type === 'organization') {
        document.getElementById('organization-tab').click();
        
        // Populate form fields
        document.getElementById('orgName').value = profile.name;
        document.getElementById('orgType').value = profile.orgType;
        document.getElementById('orgDescription').value = profile.description;
        document.getElementById('orgValues').value = profile.values.join(', ');
        
        if (profile.audience) {
            document.getElementById('orgAudienceSize').value = profile.audience.size || '';
            document.getElementById('orgRegion').value = profile.audience.region || '';
        }
        
        // Handle multi-select for partnership types
        const typesSelect = document.getElementById('partnershipTypes');
        if (typesSelect) {
            Array.from(typesSelect.options).forEach(option => {
                option.selected = profile.partnershipTypes && profile.partnershipTypes.includes(option.value);
            });
        }
    }
}

/**
 * Delete a profile
 * @param {string} profileId - ID of the profile to delete
 */
function deleteProfile(profileId) {
    if (!confirm('Are you sure you want to delete this profile?')) {
        return;
    }
    
    let profiles = getProfilesFromStorage();
    profiles = profiles.filter(profile => profile.id !== profileId);
    
    localStorage.setItem('strategicAllianceProfiles', JSON.stringify(profiles));
    
    // Update UI
    updateProfileSelectors();
    
    alert('Profile deleted successfully.');
}

/**
 * Export all profiles to a JSON file
 */
function exportProfiles() {
    const profiles = getProfilesFromStorage();
    exportToJson(profiles, 'strategic-alliance-profiles.json');
}

/**
 * Import profiles from a JSON file
 */
function importProfiles() {
    importFromJson(function(data) {
        if (Array.isArray(data)) {
            // Validate profiles
            const validProfiles = data.filter(profile => 
                profile.id && 
                profile.type && 
                profile.name && 
                (profile.type === 'brand' || profile.type === 'organization')
            );
            
            if (validProfiles.length === 0) {
                alert('No valid profiles found in the imported file.');
                return;
            }
            
            // Confirm import
            if (confirm(`Import ${validProfiles.length} profiles? This will replace any existing profiles with the same IDs.`)) {
                // Get existing profiles
                let profiles = getProfilesFromStorage();
                
                // Remove profiles with same IDs as imported ones
                const importedIds = validProfiles.map(p => p.id);
                profiles = profiles.filter(p => !importedIds.includes(p.id));
                
                // Add imported profiles
                profiles = [...profiles, ...validProfiles];
                
                // Save to local storage
                localStorage.setItem('strategicAllianceProfiles', JSON.stringify(profiles));
                
                // Update UI
                updateProfileSelectors();
                
                alert(`Successfully imported ${validProfiles.length} profiles.`);
            }
        } else {
            alert('Invalid data format. Expected an array of profiles.');
        }
    });
}

/**
 * Get all profiles of a specific type
 * @param {string} type - Profile type ('brand' or 'organization')
 * @returns {Array} Array of profiles of the specified type
 */
function getProfilesByType(type) {
    const profiles = getProfilesFromStorage();
    return profiles.filter(profile => profile.type === type);
}

/**
 * Get a profile by ID
 * @param {string} profileId - ID of the profile to get
 * @returns {object|null} The profile object or null if not found
 */
function getProfileById(profileId) {
    const profiles = getProfilesFromStorage();
    return profiles.find(profile => profile.id === profileId) || null;
}

/**
 * Display a list of profiles in the UI
 * @param {string} containerId - ID of the container element
 * @param {string} type - Profile type to display ('brand', 'organization', or 'all')
 */
function displayProfiles(containerId, type = 'all') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Get profiles
    let profiles = getProfilesFromStorage();
    
    // Filter by type if specified
    if (type !== 'all') {
        profiles = profiles.filter(profile => profile.type === type);
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Display profiles
    if (profiles.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No profiles found.</div>';
        return;
    }
    
    // Create profile cards
    profiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        
        let profileTypeDisplay = profile.type === 'brand' ? 'Brand' : 'Organization';
        let profileCategoryDisplay = profile.type === 'brand' ? profile.industry : profile.orgType;
        profileCategoryDisplay = profileCategoryDisplay.charAt(0).toUpperCase() + profileCategoryDisplay.slice(1).replace('_', ' ');
        
        card.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">${profile.name}</h5>
                <span class="badge ${profile.type === 'brand' ? 'bg-primary' : 'bg-success'}">${profileTypeDisplay}</span>
            </div>
            <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted">${profileCategoryDisplay}</h6>
                <p class="card-text">${profile.description}</p>
                <div class="mb-2">
                    ${profile.values.map(value => `<span class="badge bg-light text-dark me-1">${value}</span>`).join('')}
                </div>
                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="loadProfileForEdit('${profile.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProfile('${profile.id}')">Delete</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}