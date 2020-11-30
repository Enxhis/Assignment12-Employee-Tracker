const {prompt} = require("inquirer");
const logo = require("asciiart-logo");

// display logo prompt function
function logoDisplay() {
    const logoTxt = logo({name: "Employee Manager"}).render();
    console.log(logoTxt);
}