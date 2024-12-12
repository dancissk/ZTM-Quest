export default {
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: [
        'text',
        'html',
    ],
};
