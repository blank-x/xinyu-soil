function render(result) {
    result.data.forEach(function (value) {
        console.log(value.id, value.name);
        if (value.age) {
            console.log(value.age);
        }
        // value.id++  // 只读属性
    });
}
var result = {
    data: [
        // 鸭式变形法,存在sex属性照样能通过；  直接使用字面量对象可以使鸭式变形法失效
        { id: 1, name: 'A', sex: 'male' },
        { id: 2, name: 'B', age: 10 }
    ]
};
render(result);
/*
render({
    data: [
        //   直接使用字面量对象可以使鸭式变形法失效；
        {id: 1, name: 'A', sex: 'male'},

        {id: 2, name: 'B', age: 10}
    ]
})*/
render({
    data: [
        //   直接使用字面量对象可以使鸭式变形法失效；
        { id: 1, name: 'A', sex: 'male' },
        { id: 2, name: 'B', age: 10 }
    ]
});
render({
    data: [
        //   直接使用字面量对象可以使鸭式变形法失效；
        { id: 1, name: 'A', sex: 'male' },
        { id: 2, name: 'B', age: 10 }
    ]
});
var chars = ['a', 'b'];
function getLib() {
    var lib = (function () { });
    lib.version = '1.0.0';
    lib.doSomething = function () { };
    return lib;
}
var lib1 = getLib();
lib1();
var lib2 = getLib();
lib2.doSomething();
