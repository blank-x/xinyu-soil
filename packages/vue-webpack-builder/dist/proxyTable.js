"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    '/sign_applys/**': {
        target: 'http://api.xxx.com',
        secure: true,
        changeOrigin: true,
    },
    target: 'http://www.example.org',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
        '^/api/old-path': '/api/new-path',
        '^/api/remove/path': '/path', // remove base path
    },
    router: {
        'dev.localhost:3000': 'http://localhost:8000',
    },
};
