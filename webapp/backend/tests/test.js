// Load alias resolver and .env first
require("module-alias/register");
require("dotenv").config();

//  Manually include all test files
require("@authController.test");
require("@binarySearch.test");
require("@dogPost.test");
require("@dogSearch.test");
require("@monkeyPost.test");
require("@monkeySearch.test");
