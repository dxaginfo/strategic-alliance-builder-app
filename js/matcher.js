/**
 * Strategic Alliance Builder - Partner Matching Algorithm
 * 
 * This file contains the logic for matching potential strategic partners
 * based on alignment scores across multiple dimensions.
 */

// Weights for different alignment dimensions (must sum to 100)
const ALIGNMENT_WEIGHTS = {
    values: 30,      // Value alignment
    audience: 25,    // Audience complementarity
    goals: 25,       // Goal compatibility
    industry: 20     // Industry relevance
};

/**
 * Find matching partners for a given profile
 */
function findMatches() {
    console.log('Running partner matching algorithm...');
    
    // Get form values
    const profileId = document.getElementById('matchProfile').value;
    const selectedIndustries = Array.from(document.getElementById('matchIndustry').selectedOptions).map(opt => opt.value);
    const alignmentPriority = document.getElementById('alignmentPriority').value;
    const minAlignmentScore = parseInt(document.getElementById('minAlignmentScore').value);
    
    // Validate profile selection
    if (!profileId) {
        alert('Please select a profile to match.');
        return;
    }
    
    // Get all profiles from storage
    const allProfiles = getProfilesFromStorage();
    
    // Find the selected profile
    const selectedProfile = allProfiles.find(profile => profile.id === profileId);
    if (!selectedProfile) {
        alert('Selected profile not found.');
        return;
    }
    
    // Get potential matches (all profiles except the selected one)
    const potentialMatches = allProfiles.filter(profile => profile.id !== profileId);
    
    // Apply industry filter if specific industries are selected
    const filteredMatches = selectedIndustries.includes('all') 
        ? potentialMatches 
        : potentialMatches.filter(profile => {
            const profileIndustry = profile.industry || (profile.orgType || '');
            return selectedIndustries.some(industry => profileIndustry.includes(industry));
        });
    
    // Calculate alignment scores for each potential match
    const scoredMatches = filteredMatches.map(match => {
        const alignmentScores = calculateAlignmentScores(selectedProfile, match);
        const totalScore = calculateTotalAlignmentScore(alignmentScores);
        
        return {
            profile: match,
            alignmentScores,
            totalScore
        };
    });
    
    // Filter matches by minimum alignment score
    const qualifyingMatches = scoredMatches.filter(match => match.totalScore >= minAlignmentScore);
    
    // Sort matches by the chosen alignment priority and then by total score
    qualifyingMatches.sort((a, b) => {
        // First sort by the specified alignment priority
        const priorityDiff = b.alignmentScores[alignmentPriority] - a.alignmentScores[alignmentPriority];
        if (priorityDiff !== 0) {
            return priorityDiff;
        }
        
        // Then by total score
        return b.totalScore - a.totalScore;
    });
    
    // Display the matches
    displayMatches(qualifyingMatches);
}

/**
 * Calculate alignment scores across different dimensions
 * @param {object} profile1 - First profile
 * @param {object} profile2 - Second profile
 * @returns {object} Object containing alignment scores for each dimension
 */
function calculateAlignmentScores(profile1, profile2) {
    // Calculate value alignment (30%)
    const valueAlignment = calculateValueAlignment(profile1.values, profile2.values);
    
    // Calculate audience complementarity (25%)
    const audienceAlignment = calculateAudienceAlignment(profile1.audience, profile2.audience);
    
    // Calculate goal compatibility (25%)
    const goalAlignment = calculateGoalAlignment(profile1.goals, profile2.goals || []);
    
    // Calculate industry relevance (20%)
    const industryAlignment = calculateIndustryAlignment(profile1, profile2);
    
    return {
        values: valueAlignment,
        audience: audienceAlignment,
        goals: goalAlignment,
        industry: industryAlignment
    };
}

/**
 * Calculate the total alignment score based on individual dimension scores
 * @param {object} alignmentScores - Object containing scores for each dimension
 * @returns {number} The weighted total alignment score (0-100)
 */
function calculateTotalAlignmentScore(alignmentScores) {
    let totalScore = 0;
    
    // Apply weights to each dimension score
    for (const [dimension, weight] of Object.entries(ALIGNMENT_WEIGHTS)) {
        totalScore += (alignmentScores[dimension] * weight / 100);
    }
    
    // Round to nearest integer
    return Math.round(totalScore);
}

/**
 * Calculate value alignment between two sets of values
 * @param {Array} values1 - First set of values
 * @param {Array} values2 - Second set of values
 * @returns {number} Alignment score (0-100)
 */
function calculateValueAlignment(values1, values2) {
    if (!values1 || !values2 || values1.length === 0 || values2.length === 0) {
        return 50; // Default to neutral if no values specified
    }
    
    // Count matching values (case-insensitive)
    let matchCount = 0;
    const values1Lower = values1.map(v => v.toLowerCase());
    const values2Lower = values2.map(v => v.toLowerCase());
    
    for (const value of values1Lower) {
        if (values2Lower.some(v => v.includes(value) || value.includes(v))) {
            matchCount++;
        }
    }
    
    // Calculate match percentage based on the average match rate
    const matchRate1 = matchCount / values1.length;
    const matchRate2 = matchCount / values2.length;
    const averageMatchRate = (matchRate1 + matchRate2) / 2;
    
    // Convert to score (0-100)
    return Math.round(averageMatchRate * 100);
}

/**
 * Calculate audience alignment between two audience profiles
 * @param {object} audience1 - First audience profile
 * @param {object} audience2 - Second audience profile
 * @returns {number} Alignment score (0-100)
 */
function calculateAudienceAlignment(audience1, audience2) {
    if (!audience1 || !audience2) {
        return 50; // Default to neutral if no audience data
    }
    
    // Calculate region alignment
    const regionScore = audience1.region === audience2.region ? 100 : 
                        (audience1.region === 'global' || audience2.region === 'global') ? 80 : 50;
    
    // Calculate demographic alignment (simplified)
    let demographicScore = 70; // Default to moderate alignment
    
    // Overall audience alignment score
    return Math.round((regionScore + demographicScore) / 2);
}

/**
 * Calculate goal alignment between two sets of goals
 * @param {Array} goals1 - First set of goals
 * @param {Array} goals2 - Second set of goals
 * @returns {number} Alignment score (0-100)
 */
function calculateGoalAlignment(goals1, goals2) {
    if (!goals1 || !goals2 || goals1.length === 0 || goals2.length === 0) {
        return 50; // Default to neutral if no goals specified
    }
    
    // Count matching goals
    let matchCount = 0;
    
    for (const goal of goals1) {
        if (goals2.includes(goal)) {
            matchCount++;
        }
    }
    
    // Calculate match percentage based on the average match rate
    const matchRate1 = matchCount / goals1.length;
    const matchRate2 = matchCount / goals2.length;
    const averageMatchRate = (matchRate1 + matchRate2) / 2;
    
    // Convert to score (0-100)
    return Math.round(averageMatchRate * 100);
}

/**
 * Calculate industry alignment between two profiles
 * @param {object} profile1 - First profile
 * @param {object} profile2 - Second profile
 * @returns {number} Alignment score (0-100)
 */
function calculateIndustryAlignment(profile1, profile2) {
    // For brand-organization partnerships, certain combinations are more strategic
    if (profile1.type !== profile2.type) {
        // Example strategic combinations
        const strategicPairs = [
            { brand: 'technology', org: 'sports_team' },
            { brand: 'retail', org: 'event' },
            { brand: 'finance', org: 'nonprofit' },
            { brand: 'healthcare', org: 'education' }
        ];
        
        // Check if this pairing is in our strategic pairs list
        const brand = profile1.type === 'brand' ? profile1 : profile2;
        const org = profile1.type === 'organization' ? profile1 : profile2;
        
        for (const pair of strategicPairs) {
            if (brand.industry === pair.brand && org.orgType === pair.org) {
                return 90; // High strategic alignment
            }
        }
        
        return 70; // Moderate alignment for other brand-org pairs
    }
    
    // For same-type partnerships (brand-brand or org-org)
    if (profile1.industry === profile2.industry) {
        return 50; // Same industry = neutral (could be competitive)
    }
    
    // Different industries but potentially complementary
    return 75; // Moderately high alignment for cross-industry partnerships
}

/**
 * Display the matching results in the UI
 * @param {Array} matches - Array of matching profiles with scores
 */
function displayMatches(matches) {
    const matchesContainer = document.getElementById('matchesContainer');
    const matchResults = document.getElementById('matchResults');
    
    // Clear previous results
    if (matches.length === 0) {
        matchResults.innerHTML = `
            <div class="alert alert-warning mb-0">
                <i class="fas fa-exclamation-triangle me-2"></i>No matching partners found based on your criteria.
            </div>
        `;
        return;
    }
    
    // Show matches container
    matchesContainer.classList.remove('d-none');
    matchesContainer.innerHTML = '';
    
    // Create a match card for each match
    matches.forEach(match => {
        const profile = match.profile;
        const alignmentScores = match.alignmentScores;
        
        // Create match card element
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card border rounded p-3 mb-3';
        
        // Determine top alignment areas
        const alignmentAreas = Object.entries(alignmentScores)
            .map(([key, value]) => ({ area: key, score: value }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        
        // Format alignment areas for display
        const alignmentAreasHTML = alignmentAreas.map(area => {
            const areaNames = {
                values: 'Value Alignment',
                audience: 'Audience Complementarity',
                goals: 'Goal Compatibility',
                industry: 'Industry Relevance'
            };
            
            return `<li>${areaNames[area.area]} (${area.score}%)</li>`;
        }).join('');
        
        // Generate partnership potential text based on scores
        const partnershipPotential = generatePartnershipPotential(profile, match.totalScore, alignmentScores);
        
        // Create card content
        matchCard.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h5 class="match-name">${profile.name}</h5>
                    <p class="match-description mb-2">${profile.description}</p>
                    <div class="match-tags">
                        <span class="badge bg-light text-dark me-2">${profile.type === 'brand' ? profile.industry : profile.orgType}</span>
                        ${profile.values.slice(0, 2).map(value => 
                            `<span class="badge bg-light text-dark me-2">${value}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="text-center">
                    <div class="match-score-circle">
                        <span class="match-score">${match.totalScore}</span>
                    </div>
                    <small class="d-block mt-1">Alignment Score</small>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-sm-6">
                    <h6 class="fw-bold">Top Alignment Areas</h6>
                    <ul class="match-alignment-list">
                        ${alignmentAreasHTML}
                    </ul>
                </div>
                <div class="col-sm-6">
                    <h6 class="fw-bold">Partnership Potential</h6>
                    <p class="match-potential">${partnershipPotential}</p>
                </div>
            </div>
            <div class="d-flex justify-content-end mt-2">
                <button class="btn btn-sm btn-outline-primary me-2" onclick="viewProfile('${profile.id}')">View Profile</button>
                <button class="btn btn-sm btn-primary" onclick="analyzePartnership('${profile.id}')">Analyze Potential</button>
            </div>
        `;
        
        // Add to matches container
        matchesContainer.appendChild(matchCard);
    });
    
    // Show the count of matches
    matchResults.innerHTML = `
        <div class="alert alert-success mb-3">
            <i class="fas fa-check-circle me-2"></i>Found ${matches.length} potential strategic partners.
        </div>
    `;
    
    // Append matches container
    matchResults.appendChild(matchesContainer);
}

/**
 * Generate text describing the partnership potential
 * @param {object} profile - The partner profile
 * @param {number} totalScore - Total alignment score
 * @param {object} alignmentScores - Individual dimension scores
 * @returns {string} Description of partnership potential
 */
function generatePartnershipPotential(profile, totalScore, alignmentScores) {
    // Base potential on total score
    if (totalScore >= 90) {
        return `This partnership has exceptional potential for strategic alignment, particularly in ${getTopArea(alignmentScores)} and ${getSecondArea(alignmentScores)}.`;
    } else if (totalScore >= 80) {
        return `This partnership shows strong potential for co-created initiatives, especially in ${getTopArea(alignmentScores)}.`;
    } else if (totalScore >= 70) {
        return `Good potential for collaboration, though additional work may be needed to strengthen ${getWeakestArea(alignmentScores)}.`;
    } else {
        return `This partnership has moderate potential, but would require careful management of misalignments in ${getWeakestArea(alignmentScores)}.`;
    }
}

/**
 * Get the name of the top scoring alignment area
 * @param {object} alignmentScores - Alignment scores by dimension
 * @returns {string} Name of top area
 */
function getTopArea(alignmentScores) {
    const areaNames = {
        values: 'value alignment',
        audience: 'audience complementarity',
        goals: 'goal compatibility',
        industry: 'industry relevance'
    };
    
    const topArea = Object.entries(alignmentScores)
        .sort((a, b) => b[1] - a[1])[0][0];
    
    return areaNames[topArea];
}

/**
 * Get the name of the second best scoring alignment area
 * @param {object} alignmentScores - Alignment scores by dimension
 * @returns {string} Name of second best area
 */
function getSecondArea(alignmentScores) {
    const areaNames = {
        values: 'value alignment',
        audience: 'audience complementarity',
        goals: 'goal compatibility',
        industry: 'industry relevance'
    };
    
    const secondArea = Object.entries(alignmentScores)
        .sort((a, b) => b[1] - a[1])[1][0];
    
    return areaNames[secondArea];
}

/**
 * Get the name of the weakest scoring alignment area
 * @param {object} alignmentScores - Alignment scores by dimension
 * @returns {string} Name of weakest area
 */
function getWeakestArea(alignmentScores) {
    const areaNames = {
        values: 'value alignment',
        audience: 'audience complementarity',
        goals: 'goal compatibility',
        industry: 'industry relevance'
    };
    
    const weakestArea = Object.entries(alignmentScores)
        .sort((a, b) => a[1] - b[1])[0][0];
    
    return areaNames[weakestArea];
}

/**
 * View detailed profile information
 * @param {string} profileId - ID of the profile to view
 */
function viewProfile(profileId) {
    alert('Profile view functionality will be implemented in a future update.');
}

/**
 * Analyze potential partnership in detail
 * @param {string} profileId - ID of the partner to analyze
 */
function analyzePartnership(profileId) {
    // Switch to ROI calculator and pre-populate with partnership info
    showSection('calculator');
    alert('Partnership analysis has been started. Please complete the ROI calculator form.');
}