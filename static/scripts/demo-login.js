$('body').on('click', '#demo-login', () => {
  $('#username').val('TestUser');
  $('#password').val('TestPassword!');
  $('#login-form').submit();
});
