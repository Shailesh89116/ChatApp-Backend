const express = require("express");
const {register, login, getAllUsers} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getAllUsers);
router.route("/").post(register);
router.post("/login", login);

module.exports = router;