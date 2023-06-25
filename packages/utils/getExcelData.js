import * as XLSX from 'xlsx';

// 获取excel数据
const getExcel = (files, kesMap = 'A') =>
  new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(files);
      fileReader.onload = (e) => {
        const { result } = e.target;
        const workbook = XLSX.read(result, { type: 'binary' });
        const { Sheets = {}, SheetNames = [] } = workbook;
        const data = XLSX.utils.sheet_to_json(Sheets[SheetNames[0]], {
          range: 1, // 跳过第一行
          header: kesMap, // key值对应
          raw: false, // 统一转成字符串
          defval: null, // 空行为null
          blankrows: true, // 显示空行
        });
        resolve(data);
      };
    } catch (e) {
      reject(e);
    }
  })
    .then((res) => res)
    .catch();

export default getExcel;


export function sheet2blob(sheet: any, sheetName?: any) {
  sheetName = sheetName || 'sheet1';
  const workbook: any = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  const wopts: XLSX.WritingOptions = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary',
  };
  const wbout = XLSX.write(workbook, wopts);
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

  return blob;
}