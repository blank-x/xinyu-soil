const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");

const hook = new SyncHook(["newSpeed"]);


// hook.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));
// hook.tap("LoggerPlugin1", newSpeed => console.log(`Accelerating1 to ${newSpeed}`));
// hook.call(12)


// const hook2 = new AsyncParallelHook(["a"]);
//
// hook2.tapAsync("LoggerPlugin", (a, cb) => {
//   console.log(`a to ${a}`);
//   cb()
// });
// hook2.tapAsync("LoggerPlugin1", (a, cb) => {
//   console.log(`a to ${a}`);
//   cb()
// });
// hook2.callAsync(1, (res) => {
//   console.log('res', res)
// })

const hook3 = new AsyncParallelHook(["a"]);

hook3.tapPromise("LoggerPlugin", (a) => {
  return new Promise((resolve)=>{
    setTimeout(() => {
      resolve(1)
    }, 2000)
  })

});
hook3.tapPromise("LoggerPlugin1",(a) => {
  return new Promise((resolve)=>{
    setTimeout(() => {
      resolve(2)
    }, 0)
  })

});
hook3.promise(1).then(r => {
  console.log(r) // undefined
})

function anonymous(a, _callback
) {
  "use strict";
  var _context;
  var _x = this._x;
  do {
    var _counter = 2;
    var _done = (function () {
      _callback();
    });
    if (_counter <= 0) break;
    var _fn0 = _x[0];
    _fn0(a, (function (_err0) {
      if (_err0) {
        if (_counter > 0) {
          _callback(_err0);
          _counter = 0;
        }
      } else {
        if (--_counter === 0) _done();
      }
    }));
    if (_counter <= 0) break;
    var _fn1 = _x[1];
    _fn1(a, (function (_err1) {
      if (_err1) {
        if (_counter > 0) {
          _callback(_err1);
          _counter = 0;
        }
      } else {
        if (--_counter === 0) _done();
      }
    }));
  } while (false);

}



function anonymous(a
) {
  "use strict";
  var _context;
  var _x = this._x;
  return new Promise((function(_resolve, _reject) {
    var _sync = true;
    function _error(_err) {
      if(_sync)
        _resolve(Promise.resolve().then((function() { throw _err; })));
      else
        _reject(_err);
    };
    do {
      var _counter = 2;
      var _done = (function() {
        _resolve();
      });
      if(_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasResult0 = false;
      var _promise0 = _fn0(a);
      if (!_promise0 || !_promise0.then)
        throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise0 + ')');
      _promise0.then((function(_result0) {
        _hasResult0 = true;
        if(--_counter === 0) _done();
      }), function(_err0) {
        if(_hasResult0) throw _err0;
        if(_counter > 0) {
          _error(_err0);
          _counter = 0;
        }
      });
      if(_counter <= 0) break;
      var _fn1 = _x[1];
      var _hasResult1 = false;
      var _promise1 = _fn1(a);
      if (!_promise1 || !_promise1.then)
        throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise1 + ')');
      _promise1.then((function(_result1) {
        _hasResult1 = true;
        if(--_counter === 0) _done();
      }), function(_err1) {
        if(_hasResult1) throw _err1;
        if(_counter > 0) {
          _error(_err1);
          _counter = 0;
        }
      });
    } while(false);
    _sync = false;
  }));

}
