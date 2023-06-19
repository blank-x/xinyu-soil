//将手机号格式化为 156 **** 2091
export default function phoneFormat(val){
    val = val.toString()
    return val.replace(val.substr(3,4), " **** ")
};
