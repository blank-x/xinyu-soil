// eslint-disable-next-line no-useless-escape
export var emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
export function validateEmail(email) {
    var reg = emailReg;
    return reg.test(email);
}
export default { validateEmail: validateEmail, emailReg: emailReg };
