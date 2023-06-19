declare const _exports: {
    entry: string;
    output: {
        filename: string;
        path: string;
    };
    mode: string;
    devtool: string;
    resolve: {
        extensions: string[];
    };
    module: {
        rules: ({
            test: RegExp;
            loader: string;
        } | {
            enforce: string;
            test: RegExp;
            loader: string;
        })[];
    };
    plugins: import("html-webpack-plugin")[];
    devServer: {
        port: number;
    };
};
export = _exports;
