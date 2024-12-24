const excel = require('excel4node');
const fs = require('fs');
const path = require('path');

module.exports = function createExcel(headers, entities, data, sheetName) {
  // Create the directory if it doesn't exist
  const dir = path.dirname(sheetName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create a new instance of a Workbook class
  let wb = new excel.Workbook();
  // Add a worksheet to the workbook
  let ws = wb.addWorksheet('Sheet 1');

  // Create reusable styles
  let headerStyle = wb.createStyle({
    font: {
      color: '#000000',
      size: 14,
      bold: true,
    },
  });
  let style = wb.createStyle({
    font: {
      color: '#000000',
      size: 12,
    },
  });

  // Add headers to the sheet
  headers.forEach((header, index) => {
    ws.cell(1, index + 1)
      .string(header)
      .style(headerStyle);
  });

  // Add data to the sheet
  data.forEach((item, rowIndex) => {
    entities.forEach((entity, colIndex) => {
      let cellValue = item[entity] !== undefined && item[entity] !== null ? String(item[entity]) : '';
      ws.cell(rowIndex + 2, colIndex + 1)
        .string(cellValue)
        .style(style);
    });
  });

  wb.write(sheetName);
};
