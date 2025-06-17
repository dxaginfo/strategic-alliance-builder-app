/**
 * Strategic Alliance Builder - ROI Calculator
 * 
 * This file contains the logic for calculating the return on investment
 * for strategic partnerships, including direct, indirect, and long-term value.
 */

// Charts for displaying ROI results
let valueBreakdownChart = null;
let valueTimelineChart = null;

/**
 * Calculate ROI for a partnership
 */
function calculateROI() {
    console.log('Calculating partnership ROI...');
    
    // Get form values
    const partnershipName = document.getElementById('partnershipName').value;
    const investment = parseFloat(document.getElementById('partnershipInvestment').value);
    const duration = parseInt(document.getElementById('partnershipDuration').value);
    
    // Validate inputs
    if (!partnershipName || isNaN(investment) || isNaN(duration) || investment <= 0 || duration <= 0) {
        alert('Please enter valid partnership details.');
        return;
    }
    
    // Get direct value metrics
    const brandExposureValue = parseFloat(document.getElementById('brandExposure').value) || 0;
    const leadCount = parseInt(document.getElementById('leadCount').value) || 0;
    const leadValue = parseFloat(document.getElementById('leadValue').value) || 0;
    const conversionCount = parseInt(document.getElementById('conversionCount').value) || 0;
    const conversionValue = parseFloat(document.getElementById('conversionValue').value) || 0;
    
    // Get indirect value metrics
    const brandPerceptionLevel = document.getElementById('brandPerception').value;
    const audienceEngagementLevel = document.getElementById('audienceEngagement').value;
    
    // Get long-term value metrics
    const relationshipValueLevel = document.getElementById('relationshipValue').value;
    const innovationPotentialLevel = document.getElementById('innovationPotential').value;
    
    // Calculate values
    const directValue = calculateDirectValue(brandExposureValue, leadCount, leadValue, conversionCount, conversionValue);
    const indirectValue = calculateIndirectValue(investment, brandPerceptionLevel, audienceEngagementLevel);
    const longTermValue = calculateLongTermValue(investment, duration, relationshipValueLevel, innovationPotentialLevel);
    
    // Calculate total value and ROI
    const totalValue = directValue + indirectValue + longTermValue;
    const roi = ((totalValue - investment) / investment) * 100;
    
    // Calculate value timeline
    const valueTimeline = calculateValueTimeline(investment, directValue, indirectValue, longTermValue, duration);
    
    // Create results object
    const results = {
        partnershipName,
        investment,
        duration,
        directValue,
        indirectValue,
        longTermValue,
        totalValue,
        roi,
        valueTimeline
    };
    
    // Display results
    displayROIResults(results);
}

/**
 * Calculate the direct value of a partnership
 * @param {number} brandExposureValue - Value of brand exposure
 * @param {number} leadCount - Number of leads generated
 * @param {number} leadValue - Value per lead
 * @param {number} conversionCount - Number of conversions
 * @param {number} conversionValue - Value per conversion
 * @returns {number} Total direct value
 */
function calculateDirectValue(brandExposureValue, leadCount, leadValue, conversionCount, conversionValue) {
    const exposureValue = brandExposureValue;
    const leadsValue = leadCount * leadValue;
    const conversionsTotalValue = conversionCount * conversionValue;
    
    return exposureValue + leadsValue + conversionsTotalValue;
}

/**
 * Calculate the indirect value of a partnership
 * @param {number} investment - Partnership investment amount
 * @param {string} brandPerceptionLevel - Level of brand perception lift
 * @param {string} audienceEngagementLevel - Level of audience engagement
 * @returns {number} Total indirect value
 */
function calculateIndirectValue(investment, brandPerceptionLevel, audienceEngagementLevel) {
    // Brand perception value
    let perceptionValue = 0;
    switch (brandPerceptionLevel) {
        case 'none':
            perceptionValue = 0;
            break;
        case 'low':
            perceptionValue = investment * 0.1;
            break;
        case 'medium':
            perceptionValue = investment * 0.25;
            break;
        case 'high':
            perceptionValue = investment * 0.5;
            break;
        case 'very_high':
            perceptionValue = investment * 0.75;
            break;
    }
    
    // Audience engagement value
    let engagementValue = 0;
    switch (audienceEngagementLevel) {
        case 'none':
            engagementValue = 0;
            break;
        case 'low':
            engagementValue = investment * 0.1;
            break;
        case 'medium':
            engagementValue = investment * 0.25;
            break;
        case 'high':
            engagementValue = investment * 0.5;
            break;
        case 'very_high':
            engagementValue = investment * 0.75;
            break;
    }
    
    return perceptionValue + engagementValue;
}

/**
 * Calculate the long-term value of a partnership
 * @param {number} investment - Partnership investment amount
 * @param {number} duration - Partnership duration in months
 * @param {string} relationshipValueLevel - Level of relationship development value
 * @param {string} innovationPotentialLevel - Level of innovation potential
 * @returns {number} Total long-term value
 */
function calculateLongTermValue(investment, duration, relationshipValueLevel, innovationPotentialLevel) {
    // Relationship development value (annualized)
    let relationshipValue = 0;
    switch (relationshipValueLevel) {
        case 'none':
            relationshipValue = 0;
            break;
        case 'low':
            relationshipValue = investment * 0.05;
            break;
        case 'medium':
            relationshipValue = investment * 0.15;
            break;
        case 'high':
            relationshipValue = investment * 0.3;
            break;
    }
    
    // Innovation potential value
    let innovationValue = 0;
    switch (innovationPotentialLevel) {
        case 'none':
            innovationValue = 0;
            break;
        case 'low':
            innovationValue = investment * 0.05;
            break;
        case 'medium':
            innovationValue = investment * 0.15;
            break;
        case 'high':
            innovationValue = investment * 0.3;
            break;
        case 'very_high':
            innovationValue = investment * 0.5;
            break;
    }
    
    // Adjust relationship value for duration (annual value prorated for months)
    const annualizedRelationshipValue = relationshipValue * (duration / 12);
    
    return annualizedRelationshipValue + innovationValue;
}

/**
 * Calculate the value timeline over the partnership duration
 * @param {number} investment - Partnership investment amount
 * @param {number} directValue - Total direct value
 * @param {number} indirectValue - Total indirect value
 * @param {number} longTermValue - Total long-term value
 * @param {number} duration - Partnership duration in months
 * @returns {object} Timeline data for charting
 */
function calculateValueTimeline(investment, directValue, indirectValue, longTermValue, duration) {
    const labels = [];
    const investmentData = [];
    const valueData = [];
    
    // Create monthly data points for the timeline
    for (let month = 1; month <= duration; month++) {
        labels.push(`Month ${month}`);
        
        // Investment is spread evenly across months
        investmentData.push(investment / duration);
        
        // Value accrual model:
        // - Direct value is distributed with higher emphasis in early-mid months
        // - Indirect value builds gradually
        // - Long-term value increases over time
        
        const monthProgress = month / duration; // 0 to 1 progress through partnership
        
        // Direct value distribution (bell curve-like)
        const directMonthValue = directValue * Math.sin(monthProgress * Math.PI) / (duration / 2);
        
        // Indirect value (gradual increase)
        const indirectMonthValue = indirectValue * (monthProgress ** 1.5) / duration;
        
        // Long-term value (increases more toward end)
        const longTermMonthValue = longTermValue * (monthProgress ** 2) / duration;
        
        // Total value for this month
        valueData.push(directMonthValue + indirectMonthValue + longTermMonthValue);
    }
    
    return {
        labels,
        investmentData,
        valueData
    };
}

/**
 * Display ROI calculation results
 * @param {object} results - ROI calculation results
 */
function displayROIResults(results) {
    // Show results section, hide placeholder
    document.getElementById('roiResults').classList.remove('d-none');
    document.getElementById('roiPlaceholder').classList.add('d-none');
    
    // Update summary data
    document.getElementById('partnershipNameDisplay').textContent = results.partnershipName;
    document.getElementById('roiPercentage').textContent = Math.round(results.roi);
    document.getElementById('totalInvestment').textContent = formatCurrency(results.investment);
    document.getElementById('totalValue').textContent = formatCurrency(results.totalValue);
    
    // Generate recommendations
    document.getElementById('roiRecommendations').innerHTML = generateRecommendations(results);
    
    // Create/update value breakdown chart
    createValueBreakdownChart(results);
    
    // Create/update value timeline chart
    createValueTimelineChart(results.valueTimeline);
    
    // Save results to local storage
    saveROIResults(results);
}

/**
 * Create the value breakdown chart
 * @param {object} results - ROI calculation results
 */
function createValueBreakdownChart(results) {
    const ctx = document.getElementById('valueBreakdownChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (valueBreakdownChart) {
        valueBreakdownChart.destroy();
    }
    
    // Prepare data for pie chart
    const data = {
        labels: ['Direct Value', 'Indirect Value', 'Long-term Value'],
        datasets: [{
            data: [
                results.directValue,
                results.indirectValue,
                results.longTermValue
            ],
            backgroundColor: [
                '#4e73df',
                '#1cc88a',
                '#36b9cc'
            ],
            hoverBackgroundColor: [
                '#2e59d9',
                '#17a673',
                '#2c9faf'
            ],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
        }]
    };
    
    // Create new chart
    valueBreakdownChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const value = data.datasets[0].data[tooltipItem.index];
                        return `${data.labels[tooltipItem.index]}: ${formatCurrency(value)}`;
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Create the value timeline chart
 * @param {object} timelineData - Value timeline data
 */
function createValueTimelineChart(timelineData) {
    const ctx = document.getElementById('valueTimelineChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (valueTimelineChart) {
        valueTimelineChart.destroy();
    }
    
    // Create new chart
    valueTimelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timelineData.labels,
            datasets: [
                {
                    label: 'Value',
                    data: timelineData.valueData,
                    backgroundColor: 'rgba(28, 200, 138, 0.2)',
                    borderColor: 'rgba(28, 200, 138, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(28, 200, 138, 1)',
                    pointBorderColor: '#fff',
                    pointRadius: 3,
                    fill: true
                },
                {
                    label: 'Investment',
                    data: timelineData.investmentData,
                    backgroundColor: 'rgba(78, 115, 223, 0.2)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: '#fff',
                    pointRadius: 3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatCurrency(context.raw);
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Generate recommendations based on ROI results
 * @param {object} results - ROI calculation results
 * @returns {string} HTML with recommendations
 */
function generateRecommendations(results) {
    let recommendationsHtml = '';
    
    // Overall recommendation based on ROI
    if (results.roi >= 200) {
        recommendationsHtml += `<p><strong>This partnership shows exceptional potential with a very high ROI (${Math.round(results.roi)}%).</strong></p>`;
    } else if (results.roi >= 100) {
        recommendationsHtml += `<p><strong>This partnership shows strong potential with a positive ROI (${Math.round(results.roi)}%).</strong></p>`;
    } else if (results.roi >= 0) {
        recommendationsHtml += `<p><strong>This partnership has a positive but moderate ROI (${Math.round(results.roi)}%).</strong></p>`;
    } else {
        recommendationsHtml += `<p><strong>This partnership currently shows a negative ROI (${Math.round(results.roi)}%). Consider adjusting the strategy.</strong></p>`;
    }
    
    // Generate specific recommendations
    recommendationsHtml += '<ul>';
    
    // Value distribution recommendations
    const totalValue = results.directValue + results.indirectValue + results.longTermValue;
    const directValuePercent = (results.directValue / totalValue) * 100;
    const indirectValuePercent = (results.indirectValue / totalValue) * 100;
    const longTermValuePercent = (results.longTermValue / totalValue) * 100;
    
    if (directValuePercent > 70) {
        recommendationsHtml += '<li>Consider strategies to enhance long-term value creation, as the current model is heavily weighted toward direct outcomes.</li>';
    }
    
    if (indirectValuePercent < 20) {
        recommendationsHtml += '<li>Explore ways to increase brand perception lift and audience engagement to improve indirect value.</li>';
    }
    
    if (longTermValuePercent < 15) {
        recommendationsHtml += '<li>Develop a more robust long-term strategy for this partnership to enhance relationship and innovation value.</li>';
    }
    
    // Investment optimization
    if (results.investment > results.totalValue * 0.8) {
        recommendationsHtml += '<li>The current investment may be too high relative to projected returns. Consider renegotiating or restructuring the deal.</li>';
    }
    
    // Add general recommendation
    recommendationsHtml += '<li>Implement robust tracking metrics to validate these projections and adjust strategy as needed.</li>';
    
    recommendationsHtml += '</ul>';
    
    return recommendationsHtml;
}

/**
 * Save ROI results to local storage
 * @param {object} results - ROI calculation results
 */
function saveROIResults(results) {
    // Get existing saved results
    let savedResults = localStorage.getItem('strategicAllianceROIResults');
    savedResults = savedResults ? JSON.parse(savedResults) : [];
    
    // Add timestamp to results
    const resultsWithTimestamp = {
        ...results,
        timestamp: new Date().toISOString(),
        id: generateId()
    };
    
    // Add new results
    savedResults.push(resultsWithTimestamp);
    
    // Save back to local storage
    localStorage.setItem('strategicAllianceROIResults', JSON.stringify(savedResults));
}