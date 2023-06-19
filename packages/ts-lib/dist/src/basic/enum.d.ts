declare enum Role {
    Reporter = 1,
    Developer = 2,
    Maintainer = 3,
    Owner = 4,
    Guest = 5
}
declare enum Message {
    Success = "\u606D\u559C\u4F60\uFF0C\u6210\u529F\u4E86",
    Fail = "\u62B1\u6B49\uFF0C\u5931\u8D25\u4E86"
}
declare enum Answer {
    N = 0,
    Y = "Yes"
}
declare enum Char {
    a = 0,
    b = 0,
    c = 4,
    d,
    e,
    f = 4
}
declare const enum Month {
    Jan = 0,
    Feb = 1,
    Mar = 2,
    Apr = 3
}
declare let month: Month[];
declare enum E {
    a = 0,
    b = 1
}
declare enum F {
    a = 0,
    b = 1
}
declare enum G {
    a = "apple",
    b = "banana"
}
declare let e: E;
declare let f: F;
declare let e1: E.a;
declare let e2: E.b;
declare let e3: E.a;
declare let g1: G;
declare let g2: G.a;
