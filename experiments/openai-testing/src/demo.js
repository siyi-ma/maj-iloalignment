import OpenAIExperiment from './index.js';

/**
 * Demo script to test OpenAI integration with sample CLO-MLO pairs
 */
async function runDemo() {
    const experiment = new OpenAIExperiment();
    
    // Sample test cases from TalTech IT Faculty
    const testCases = [
        {
            name: "Database Design Alignment",
            clo: "Students will be able to design and implement relational database schemas with proper normalization",
            mlo: "Demonstrate understanding of database design principles and normalization techniques"
        },
        {
            name: "Programming Fundamentals",
            clo: "Students can write, debug, and test object-oriented programs using modern programming languages",
            mlo: "Apply object-oriented programming concepts to solve computational problems"
        },
        {
            name: "Network Security",
            clo: "Students will analyze network security threats and implement appropriate countermeasures",
            mlo: "Evaluate cybersecurity risks in networked systems"
        },
        {
            name: "Data Structures",
            clo: "Students can select and implement appropriate data structures for specific algorithmic problems",
            mlo: "Understand fundamental data structures and their applications"
        },
        {
            name: "Software Engineering",
            clo: "Students will apply software engineering methodologies to develop large-scale applications",
            mlo: "Demonstrate knowledge of software development life cycle processes"
        }
    ];

    console.log('🚀 Starting OpenAI CLO-MLO Analysis Demo...\n');
    console.log('Note: Make sure to set OPENAI_API_KEY environment variable\n');

    try {
        // Run batch analysis
        const results = await experiment.batchAnalysis(testCases);
        
        // Generate report
        const report = experiment.generateReport(results);
        
        // Display results
        console.log('📊 Analysis Complete!\n');
        console.log('=== SUMMARY ===');
        console.log(`Total tests: ${report.summary.totalTests}`);
        console.log(`Successful: ${report.summary.successful}`);
        console.log(`Failed: ${report.summary.failed}`);
        console.log(`Average score: ${report.summary.averageScore}`);
        console.log(`Total tokens used: ${report.summary.totalTokensUsed}\n`);
        
        console.log('=== SCORE DISTRIBUTION ===');
        for (let i = 1; i <= 5; i++) {
            const count = report.scoreDistribution[`score${i}`];
            console.log(`Score ${i}: ${count} cases`);
        }
        
        console.log('\n=== DETAILED RESULTS ===');
        results.forEach((result, index) => {
            console.log(`\n${index + 1}. ${result.testCase}`);
            if (result.error) {
                console.log(`   ❌ Error: ${result.error}`);
            } else {
                console.log(`   ✅ Score: ${result.result.score}/5`);
                console.log(`   📝 Justification: ${result.result.justification}`);
                if (result.result.keywords) {
                    console.log(`   🔍 Keywords: ${result.result.keywords}`);
                }
            }
        });

        // Save results to file
        const fs = await import('fs/promises');
        const outputPath = './docs/demo-results.json';
        await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
        console.log(`\n💾 Results saved to ${outputPath}`);

    } catch (error) {
        console.error('Demo failed:', error);
        console.log('\n💡 Tips:');
        console.log('1. Make sure OPENAI_API_KEY is set in your environment');
        console.log('2. Check your OpenAI account has sufficient credits');
        console.log('3. Verify internet connection');
    }
}

// Check if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runDemo();
}
