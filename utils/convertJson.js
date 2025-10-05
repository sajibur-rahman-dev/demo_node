const convertJson = {};

convertJson.parseJson = (jsonStr) => {
  let output;
  try {
    output = JSON.parse(jsonStr);
  } catch (error) {
    output = {};
  }

  return output;
};

module.exports = convertJson;
