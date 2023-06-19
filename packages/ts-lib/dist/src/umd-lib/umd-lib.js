(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    }
    else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    }
    else {
        root.umdLib = factory();
    }
}(this, function () {
    return {
        version: '1.0.0',
        add: function () {
            console.log('umdlib add');
        }
    };
}));
//# sourceMappingURL=umd-lib.js.map