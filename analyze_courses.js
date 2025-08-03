// Quick script to analyze course-module relationships
fetch('./data/programmes.json')
    .then(response => response.json())
    .then(data => {
        console.log('=== COURSE-MODULE ANALYSIS ===');
        
        const courseModules = new Map();
        
        // Process each programme
        Object.keys(data).forEach(programmeCode => {
            const programme = data[programmeCode];
            if (programme.courses) {
                programme.courses.forEach(course => {
                    const courseCode = course.ainekood;
                    const moduleCode = course.moodulikood;
                    
                    if (!courseModules.has(courseCode)) {
                        courseModules.set(courseCode, {
                            name: course.ainenimetusik,
                            modules: new Set()
                        });
                    }
                    
                    courseModules.get(courseCode).modules.add(moduleCode);
                });
            }
        });
        
        // Find courses with multiple modules
        const multiModuleCourses = [];
        courseModules.forEach((courseInfo, courseCode) => {
            if (courseInfo.modules.size > 1) {
                multiModuleCourses.push({
                    code: courseCode,
                    name: courseInfo.name,
                    modules: Array.from(courseInfo.modules)
                });
            }
        });
        
        console.log(`Found ${multiModuleCourses.length} courses belonging to multiple modules:`);
        multiModuleCourses.forEach(course => {
            console.log(`${course.code} - ${course.name}`);
            console.log(`  Modules: ${course.modules.join(', ')}`);
        });
        
        if (multiModuleCourses.length === 0) {
            console.log('No courses found with multiple module assignments.');
        }
    })
    .catch(error => {
        console.error('Error analyzing courses:', error);
    });
