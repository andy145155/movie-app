const fs = require('fs');

function handler(data, serverless, options) {
  const { output } = serverless.service.custom;
  const cleanedData = Object.entries(data).reduce((collector, [key, value]) => {
    const prev = Object.assign({}, collector);
    if (!key.endsWith('QualifiedArn')) {
      prev[key] = value;
    }
    return prev;
  }, {});
  const content = JSON.stringify(cleanedData, null, 2) + '\n';
  fs.writeFileSync(output.file_path, content);
  global.console.log(
    `Written Stack Output to ${output.file_path}`,
    cleanedData
  );
}

module.exports = { handler };