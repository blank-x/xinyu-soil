/* eslint-disable no-param-reassign */
// @ts-ignore
import * as H from '@babel/helper-create-regexp-features-plugin/lib/index';
// @ts-ignore
import * as rewritePattern from 'regexpu-core';

import * as ExcelJS from 'exceljs';

const { generateRegexpuOptions } = H;
interface ICellErrorInfo {
  cellIndex: string;
  errorMessage: string;
}
interface ISheetProps {
  [key: string]: {
       colTitle: string;
       type: 'list' | 'number' | 'text' | 'custome';
       allowBlank: boolean;
       valueErrorMessage?: string;
       formulae?: any;
       isUnique?: boolean;
  }
}

function isInteger(value: number) {
  return value % 1 === 0;
}
function dataValidation(value: any, validation: any) {
  if (!validation) {
    return true;
  }
  if (!validation.allowBlank && (!value || !String(value))) {
    return false;
  }
  //  默认规则
  if (value && validation.type === 'list' && !validation.formulae.includes(String(value))) {
    return false;
  }
  if (value && validation.type === 'number' && !isInteger(Number(value))) {
    return false;
  }
  if (value && validation.type === 'custom' && !validation.formulae.test(value)) {
    return false;
  }
  if (value && validation.type === 'text' && validation.formulae && value.length > validation.formulae) {
    return false;
  }
  return true;
}

/**
 * 工具函数
 * @returns
 */
function getEN() {
  const arr = [null] as any;
  for (let i = 65; i < 91; i++) {
    arr.push(String.fromCharCode(i));
  }
  return arr;
}

export const readExcel = async (file: ExcelJS.Buffer) => {
  // 以下是对excel的处理
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);
  return workbook;
};

export const checkExcel = async (file: any, sheetProps: ISheetProps) => {
  const result: { errorFlag: boolean; errorFile?: Blob} = {
    errorFlag: false,
    errorFile: undefined,
  };

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);

  const worksheet = workbook.worksheets && workbook.worksheets[0];
  if (!worksheet) {
    return result;
  }

  const A2Zarray = getEN();
  let columnCount = 0;
  let rowCount = 0;
  worksheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: any) => {
    rowCount += 1;

    // 校验模板
    if (rowNumber === 1) {
      if (!row.values.length || row.values.length - 1 > Object.keys(sheetProps).length) {
        throw new Error('导入文件模板有误');
      }
      row.values.forEach((title: string, index: number) => {
        if (index && sheetProps[A2Zarray[index]] && sheetProps[A2Zarray[index]].colTitle !== title) {
          throw new Error('导入文件模板有误');
        }
      });

      columnCount = row.values.length;
      row.getCell(columnCount).value = '错误信息';
    }

    // 校验数据
    if (rowNumber > 1 && Array.isArray(row.values)) {
      for (let i = 1; i < columnCount; i += 1) {
        const colIndex = A2Zarray[i];
        if (!dataValidation(row.values[i], sheetProps[colIndex])) {
          result.errorFlag = true;
          row.getCell(columnCount).value = sheetProps[colIndex].valueErrorMessage || '值为空或类型错误，请检查';
        }
      }
    }
  });

  if (rowCount <= 1) {
    throw new Error('导入文件数据为空');
  }

  // 写入错误信息
  if (result.errorFlag) {
    const buffer = await workbook.xlsx.writeBuffer();
    result.errorFile = new Blob([buffer], { type: file.type });
  }

  return result;
};

export default {};
