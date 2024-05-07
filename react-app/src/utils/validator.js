function validateEmail(email) {
    // regx for email validation
    const email_regx = "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{3,3})$";
    return email.match(email_regx);
  }
  
  function validatePassword(pass) {
    // regx for password validation
    const lowerCase = /[a-z]/g;
    const upperCase = /[A-Z]/g;
    const numbers = /[0-9]/g;
    let msg = "";
  
    if (!pass.match(lowerCase)) {
      msg = "Password should contain lowercase letters!";
    } else if (!pass.match(upperCase)) {
      msg = "Password should contain uppercase letters!";
    } else if (!pass.match(numbers)) {
      msg = "Password should contain numbers also!";
    } else if (pass.length < 6) {
      msg = "Password should contain atleast 6 characters!";
    }
  
    return msg;
  }
  
  module.exports = {
    validateEmail,
    validatePassword
  };
  