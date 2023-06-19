function moduleLib(options) {
    console.log(options);
}
moduleLib.version = '1.0.0';
moduleLib.add = function () {
    console.log('add');
};
module.exports = moduleLib;
//# sourceMappingURL=common-lib.js.map