import { getCookie, setCookie, delCookie, getAllCookie } from './cookie/cookie';
import precision from './calculate/precision';
import { validateEmail, emailReg } from './validate/email';
import { validatePhone, phoneReg } from './validate/phone';
import { deepClone } from './basic/deepClone'
import { isEmptyObject } from './basic/isEmptyObject'
import { objectFalsyFilter } from './basic/objectFalsyFilter'
import { isValidUrl, setUrlParams, getUrlParams } from './urltools';

export { getCookie, setCookie, delCookie, getAllCookie, precision, isEmptyObject, objectFalsyFilter, validateEmail, emailReg, validatePhone, phoneReg, isValidUrl, setUrlParams, getUrlParams, deepClone }

export default { getCookie, setCookie, delCookie, getAllCookie, precision, isEmptyObject, objectFalsyFilter, validateEmail, emailReg, validatePhone, phoneReg, isValidUrl, setUrlParams, getUrlParams, deepClone };
