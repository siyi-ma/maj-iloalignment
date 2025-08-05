# Experiments Directory

This directory contains experimental features and research implementations that are not part of the main CLO-MLO application.

## Current Experiments

### 📁 openai-testing/
**Purpose**: Evaluate OpenAI API for CLO-MLO analysis  
**Status**: Ready for testing  
**Goal**: Compare OpenAI vs Gemini API vs local analysis methods  

**Quick Start**:
```bash
cd experiments/openai-testing
npm install
export OPENAI_API_KEY="your_key_here"
npm run demo
```

**What it does**:
- Tests OpenAI's GPT models for educational content alignment analysis
- Compares accuracy, cost, and explanation quality vs existing methods
- Generates comprehensive reports for integration decisions

**Key Files**:
- `src/demo.js` - Simple demonstration with sample data
- `src/test-openai.js` - Comprehensive comparison testing
- `docs/README.md` - Detailed documentation

## Guidelines for Experiments

### 1. **Self-Contained**
Each experiment should be completely independent with its own:
- `package.json` for dependencies
- Documentation in `docs/` folder
- Test data and scripts

### 2. **Clear Objectives**
Every experiment should have:
- Defined goals and success criteria
- Test cases and evaluation metrics
- Integration decision framework

### 3. **Documentation**
Include:
- Setup instructions
- Usage examples
- Results interpretation
- Integration recommendations

### 4. **Naming Convention**
Use descriptive folder names:
- `feature-name-testing/` - For feature evaluation
- `api-comparison/` - For API/service comparisons
- `algorithm-research/` - For algorithm implementations

## Moving from Experiment to Production

### Criteria for Integration
1. **Performance**: Meets or exceeds existing functionality
2. **Reliability**: >95% success rate in testing
3. **Cost-Effectiveness**: Reasonable resource usage
4. **Maintainability**: Clean, documented code

### Integration Process
1. Complete experimental evaluation
2. Document findings and recommendations
3. Create integration plan
4. Implement in main codebase with proper testing
5. Archive experiment with final report

## Current Research Areas

### 🔬 Active Research
- **AI-Enhanced Analysis**: Testing different AI providers for text analysis
- **Natural Language Processing**: Improving CLO-MLO text understanding
- **Performance Optimization**: Exploring faster analysis methods

### 🎯 Future Experiments
- **Multi-language Support**: Estonian/English CLO-MLO analysis
- **Automated CLO Generation**: AI-assisted CLO creation from course content
- **Real-time Collaboration**: Live editing and analysis features
- **Advanced Visualization**: Interactive charts and dashboards

## Experiment Lifecycle

```
Idea → Planning → Implementation → Testing → Evaluation → Decision
                                                          ↓
                     Archive ← Integration ← Approved
```

### Statuses
- **🟡 Planning**: Concept development, requirements gathering
- **🔵 Active**: Implementation and testing in progress  
- **🟢 Ready**: Testing complete, awaiting integration decision
- **✅ Integrated**: Successfully moved to main application
- **📁 Archived**: Completed experiment, kept for reference

---

**Note**: Experiments are research projects and may not work in all environments. Always test thoroughly before considering integration into the main application.

**Contact**: Academic Analytics Team  
**Last Updated**: August 5, 2025
