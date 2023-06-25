/* eslint-disable @typescript-eslint/no-explicit-any */
import XLSX from 'xlsx';

function exportJsonToExcel({ header, data, fileName, extTitle, autoWidth = true }: any) {
  const keys = Object.keys(header);
  const headers = Object.values(header);

  const tempData = data.map((item: any) => {
    const ary: any[] = [];
    keys.forEach(key => {
      ary.push(item[key]);
    });
    return ary;
  });

  // 添加表格头信息
  tempData.unshift(headers);

  if (extTitle) {
    // 额外标题
    tempData.unshift([extTitle]);
  }

  const ws = XLSX.utils.aoa_to_sheet(tempData);

  if (autoWidth) {
    // 设置worksheet每列的最大宽度
    const widths: any[] = [];
    tempData.forEach((row: any) => {
      row.forEach((val: any, index: number) => {
        let len = 2;
        if (val) {
          len = val.length;
          Array.from({ length: len }).forEach((_, i) => {
            if (val.toString().charCodeAt(i) > 255) {
              len += 1;
            }
          });
        }
        const width = widths[index];
        if (width) {
          if (width < len) {
            widths[index] = len;
          }
        } else {
          widths[index] = len;
        }
      });
    });
    ws['!cols'] = widths.map(item => ({ wch: item }));
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, extTitle || 'SheetJS');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

export const getSheetData = (header: any, data: any, extTitle: any, autoWidth = true) => {
  const keys = Object.keys(header);
  const headers = Object.values(header);

  const tempData = data.map((item: any) => {
    const ary: any[] = [];
    keys.forEach(key => {
      ary.push(item[key]);
    });
    return ary;
  });

  // 添加表格头信息
  tempData.unshift(headers);

  const ws = XLSX.utils.aoa_to_sheet(tempData);

  if (autoWidth) {
    // 设置worksheet每列的最大宽度
    const widths: any[] = [];
    tempData.forEach((row: any) => {
      row.forEach((val: any, index: number) => {
        let len = 2;
        if (val) {
          len = val.length;
          Array.from({ length: len }).forEach((_, i) => {
            if (val.toString().charCodeAt(i) > 255) {
              len += 1;
            }
          });
        }
        const width = widths[index];
        if (width) {
          if (width < len) {
            widths[index] = len;
          }
        } else {
          widths[index] = len;
        }
      });
    });
    ws['!cols'] = widths.map(item => ({ wch: item }));
  }
  return ws;
};

export const exportSheetsToExcel = (sheets: any, fileName: string) => {
  const wb = XLSX.utils.book_new();
  sheets.forEach((sheet: any) => {
    XLSX.utils.book_append_sheet(wb, sheet.ws, sheet.extTitle || 'sheetJS');
  });
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export default exportJsonToExcel;
