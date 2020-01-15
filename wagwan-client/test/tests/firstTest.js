module.exports = {
    'Login Test' : function (browser) {
        const mainLoginButton = '#beginLogin';
        const loginloginButton = '#loginButtonLogin'
        const userAuthenticated = '#userHandleTest'

        const emailQuery = 'user1@mail.com';
        const passwordQuery = '123456';


        browser
            .url('http://localhost:3000/')
            .assert.elementPresent(mainLoginButton)
            .click(mainLoginButton)
            .setValue('#email', emailQuery)
            .setValue('#password', passwordQuery)
            .click(loginloginButton)
            .waitForElementVisible(userAuthenticated, 10000)
            .assert.elementPresent(userAuthenticated)
            .assert.containsText(userAuthenticated, 'user1')

            .saveScreenshot('test_outputs/Login_test.png')
            .end();
    },

    'Signup Test' : function (browser) {
        const mainSignupButton = '#beginSignup';
        const SignUpSignupButton = '#SignButtonSign'
        const userAuthenticated = '#userHandleTest'

        const emailQuery = 'userTesterrrrrr@mail.com';
        const passwordQuery = '123456';
        const confirmPasswordQuery = '123456';
        const userHandle = 'userTesterrrrrr'

        browser
            .url('http://localhost:3000/')
            .assert.elementPresent(mainSignupButton)
            .click(mainSignupButton)
            .setValue('#email', emailQuery)
            .setValue('#password', passwordQuery)
            .setValue('#confirmPassword', confirmPasswordQuery)
            .setValue('#handle', userHandle)
            .click(SignUpSignupButton)
            .waitForElementVisible(userAuthenticated, 10000)
            .assert.elementPresent(userAuthenticated)
            .assert.containsText(userAuthenticated, userHandle)

            .saveScreenshot('test_outputs/Signup_test.png')
            .end();
    },

    'CreateAndDeletePostLogout' : function (browser) {
        const mainLoginButton = '#beginLogin';
        const loginloginButton = '#loginButtonLogin';
        const dialogInput = '#postAScreamDialaog';
        const postAScream = '#whatsOnYourMindTest';

        const emailQuery = 'user1@mail.com';
        const passwordQuery = '123456';
        const fillPost = '#textAreaTest';
        const submitScream = '#submitScreamTest';

        const submittedComment = '#submitedCommentTest';
        const commentInputed = 'This is a test by NightWatch js'
        const deletePost = '#deleteCommentTest'

        const approveDeleteButton = '#youSureFinnaDelete';
        const approveDeleteText = 'You sure you finna delete the post?';
        const deletePostButton = '#deleteThePost';

        const logoutButton = "#logoutButton";
        const noProfileFoundId = "#doneTesting";
        const noProfileFoundText = "No profile Found, Try again";

        browser
            .url('http://localhost:3000/')
            .assert.elementPresent(mainLoginButton)
            .click(mainLoginButton)
            .setValue('#email', emailQuery)
            .setValue('#password', passwordQuery)
            .click(loginloginButton)
            .click('#postScreamTest')
            .waitForElementVisible(dialogInput, 10000)
            .assert.containsText(postAScream, "What's on your mind?")
            .setValue(fillPost, commentInputed)
            .click(submitScream)
            .waitForElementVisible(dialogInput, 10000)
            .assert.containsText(submittedComment, commentInputed)
            .click(deletePost)
            .assert.containsText(approveDeleteButton, approveDeleteText)
            .click(deletePostButton)
            .click(logoutButton)
            .assert.containsText(noProfileFoundId, noProfileFoundText)



            .saveScreenshot('test_outputs/Login_test.png')
            .end();
    }
};
