export default {
    development: {
        systemName: '灵众票务平台',
        noNeedLogin: true,
        needGetUserInfo: true,
        reqBaseUrl: 'http://localhost:3005/api',
        token: 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1NzQzNDM0NjYsInVzZXIiOiJ7XCJpZFwiOjIsXCJyb2xlc1wiOltcIlNZU1RFTV9NQU5BR0VSXCJdLFwidXNlcm5hbWVcIjpcInhpYW9taW5saXVAc29odS1pbmMuY29tXCJ9In0.c2L4HmJT3gzNwnuXSKUL8GEhRDRakpgxDtNj-W5g8ZU3qnn-cNDVfJ7xDZY0tah5r6wRaCJMDmqNC0sbvYgmNQ'
    },
    test: {
        systemName: '灵众票务平台',
        noNeedLogin: true,
        reqBaseUrl: 'http://localhost:3005/api',
        token: ''
    },
    production: {
        systemName: '灵众票务平台',
        noNeedLogin: true,
        reqBaseUrl: 'http://127.0.0.1:3005/api',
        token: '',
    }
}