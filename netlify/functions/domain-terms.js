const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const programmeCode = event.queryStringParameters.programme || '';
  const dataPath = path.join(__dirname, '../../data/domain_terms.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const allTerms = JSON.parse(raw).domainTerms;
  const terms = allTerms.filter(t => t.programmes.includes(programmeCode));
  return {
    statusCode: 200,
    body: JSON.stringify(terms)
  };
};