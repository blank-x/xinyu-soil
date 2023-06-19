import * as React from "react";
import * as ReactDOM from "react-dom";
import { Hello } from "./components/Hello";
import './global-lib';
import './global-lib2';
import './common-lib';
import './umd-lib';
// import './basic'
import './basic/enum';
import './basic/class';
ReactDOM.render(React.createElement(Hello, { compiler: "TypeScript", framework: "React" }), document.getElementById("example"));
