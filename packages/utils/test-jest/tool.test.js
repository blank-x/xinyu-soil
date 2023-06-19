import formatDate from "../lib/tool/formatDate";
import phoneFormat from "../lib/tool/phoneFormat";
import registerCount from "../lib/tool/registerCount";
import throttle from "../lib/tool/throttle";
describe('tool', () => {
  test('formatDate', () => {
    // (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
    expect(formatDate(new Date('2016'), 'yyyy-M-d hh:mm:ss')).toBe('2016-1-1 08:00:00')
  })
  test('phoneFormat', () => {
    // (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
    expect(phoneFormat(15811023021)).toBe('158 **** 3021')
    expect(phoneFormat('15811023021')).toBe('158 **** 3021')
  })

  test('registerCount', (done) => {
    //
    let registerCounter = registerCount()
    registerCounter(60,function () {done()},function () {})
  })
  test('throttle',(done)=>{
    let throttler = throttle(function () {
      done()
    },1000,true)
    throttler()
  })
})
