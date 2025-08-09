exports.handler = async function(event, context) {
  // Example: return static usage data
  return {
    statusCode: 200,
    body: JSON.stringify({
      dailyTokens: 12345,
      dailyLimit: 30000,
      dailyRequests: 12,
      requestLimit: 30
    })
  };
};