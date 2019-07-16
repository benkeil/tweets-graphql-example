// jest.config.js
module.exports = {
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "/tests/.*\\.spec\\.ts$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    collectCoverage: true,
    coverageReporters: [
        "json",
        "html"
    ],
    coveragePathIgnorePatterns: [
        "/tests/"
    ],
    coverageThreshold: {
        global: {
            branches: 30,
            functions: 30,
            lines: 30,
            statements: 30
        }
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
    verbose: true,
};