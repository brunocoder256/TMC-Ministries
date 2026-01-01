function parseGoogleSheet(text) {
  return JSON.parse(text.substring(47).slice(0, -2)).table.rows;
}

function fetchSheet(sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  return fetch(url)
    .then(res => res.text())
    .then(parseGoogleSheet);
}
