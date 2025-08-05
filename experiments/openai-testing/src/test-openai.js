import AnalysisComparison from './compare-analysis.js';

/**
 * Test runner for comparison framework
 */
async function runComparisonTest() {
    const comparison = new AnalysisComparison();
    
    // Extended test cases covering different scenarios
    const testCases = [
        {
            name: "Strong Alignment - Database",
            clo: "Students will be able to design and implement relational database schemas with proper normalization",
            mlo: "Demonstrate understanding of database design principles and normalization techniques"
        },
        {
            name: "Moderate Alignment - Programming",
            clo: "Students can write, debug, and test object-oriented programs",
            mlo: "Apply programming concepts to solve computational problems"
        },
        {
            name: "Weak Alignment - Different Domains",
            clo: "Students will analyze network security threats and implement countermeasures",
            mlo: "Understand basic mathematics and statistics principles"
        },
        {
            name: "Technical Detail Match",
            clo: "Students can implement sorting algorithms with O(n log n) complexity",
            mlo: "Demonstrate knowledge of algorithm efficiency and complexity analysis"
        },
        {
            name: "Broad vs Specific",
            clo: "Students will develop comprehensive software solutions",
            mlo: "Apply unit testing methodologies in software development"
        }
    ];

    console.log('🧪 Starting Comprehensive Analysis Comparison...\n');
    
    try {
        const report = await comparison.runComparison(testCases);
        
        console.log('📈 COMPARISON COMPLETE!\n');
        console.log('=== SUMMARY ===');
        console.log(`Total tests: ${report.summary.totalTests}`);
        console.log(`OpenAI successful: ${report.summary.successfulOpenAI}/${report.summary.totalTests}`);
        console.log(`Average variance: ${report.summary.averageVariance.toFixed(2)}\n`);
        
        console.log('=== PROVIDER STATISTICS ===');
        Object.entries(report.providerStats).forEach(([provider, stats]) => {
            console.log(`${provider.toUpperCase()}:`);
            if (stats.error) {
                console.log(`  Error: ${stats.error}`);
            } else {
                console.log(`  Average Score: ${stats.averageScore}`);
                console.log(`  Score Range: ${stats.minScore} - ${stats.maxScore}`);
                console.log(`  Total Analyses: ${stats.totalAnalyses}`);
            }
            console.log('');
        });
        
        console.log('=== RECOMMENDATIONS ===');
        report.recommendations.forEach((rec, index) => {
            console.log(`${index + 1}. ${rec}`);
        });
        
        console.log('\n=== DETAILED ANALYSIS ===');
        report.detailedResults.forEach((result, index) => {
            console.log(`\n${index + 1}. ${result.testCase}`);
            console.log(`   Consistency: ${result.comparison.consistency}`);
            console.log(`   Recommended: ${result.comparison.recommendedProvider}`);
            console.log(`   Reasoning: ${result.comparison.reasoning}`);
        });

        // Save comprehensive report
        const fs = await import('fs/promises');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `comparison-report-${timestamp}.json`;
        await fs.writeFile(`./docs/${filename}`, JSON.stringify(report, null, 2));
        console.log(`\n💾 Full report saved to docs/${filename}`);

        // Generate summary markdown
        const markdown = generateMarkdownReport(report);
        await fs.writeFile('./docs/comparison-summary.md', markdown);
        console.log('📄 Summary report saved to docs/comparison-summary.md');

    } catch (error) {
        console.error('Comparison test failed:', error);
    }
}

/**
 * Generate markdown report
 * @param {Object} report 
 * @returns {string} Markdown content
 */
function generateMarkdownReport(report) {
    const timestamp = new Date().toLocaleString();
    
    return `# CLO-MLO Analysis Comparison Report

**Generated:** ${timestamp}

## Executive Summary

- **Total Test Cases:** ${report.summary.totalTests}
- **OpenAI Success Rate:** ${report.summary.successfulOpenAI}/${report.summary.totalTests} (${(report.summary.successfulOpenAI/report.summary.totalTests*100).toFixed(1)}%)
- **Average Score Variance:** ${report.summary.averageVariance.toFixed(2)}

## Provider Performance

${Object.entries(report.providerStats).map(([provider, stats]) => {
    if (stats.error) {
        return `### ${provider.toUpperCase()}\n- Status: Error - ${stats.error}`;
    }
    return `### ${provider.toUpperCase()}
- Average Score: ${stats.averageScore}/5
- Score Range: ${stats.minScore} - ${stats.maxScore}
- Total Analyses: ${stats.totalAnalyses}`;
}).join('\n\n')}

## Key Findings

${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

## Test Case Details

${report.detailedResults.map((result, i) => `### ${i + 1}. ${result.testCase}
- **Consistency Level:** ${result.comparison.consistency}
- **Recommended Provider:** ${result.comparison.recommendedProvider}
- **Score Variance:** ${result.comparison.scoreVariance.toFixed(2)}
- **Reasoning:** ${result.comparison.reasoning}

**Scores:**
- OpenAI: ${result.openai.error ? 'ERROR' : result.openai.result.score}/5
- Gemini: ${result.gemini.result.score}/5  
- Local: ${result.local.result.score}/5`).join('\n\n')}

## Recommendations for Integration

Based on this analysis, consider the following next steps:

1. **If OpenAI performs well:** Integrate OpenAI as primary analysis engine with Gemini as fallback
2. **If variance is high:** Implement ensemble approach combining multiple providers
3. **If local method sufficient:** Continue with existing implementation and use AI for edge cases
4. **Cost consideration:** Monitor token usage and implement caching for repeated analyses

---
*Report generated by OpenAI Experiment Framework*
`;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runComparisonTest();
}
