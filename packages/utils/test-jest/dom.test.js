import removeClass from '../lib/dom/removeClass'
import addClass from '../lib/dom/addClass'

describe('dom测试/dom',()=>{

    test('addClass',()=>{
        document.body.innerHTML =  '<div id="container"></div>'
        var element = document.getElementById("container")
        var classValue = '_add_class_'
        addClass(element,classValue)
        expect(!!element.className.match(new RegExp('(\\s|^)' + classValue + '(\\s|$)'))).toBe(true)
    })

    test('removeClass',()=>{
        var classValue = '_add_class_'
        document.body.innerHTML =  `<div id="container" class="${classValue}"></div>`
        var element = document.getElementById("container")
        expect(element.className.indexOf(classValue)>-1).toBe(true)
        removeClass(element,classValue)
        expect(element.className.indexOf(classValue)>-1).toBe(false)
    })
})
