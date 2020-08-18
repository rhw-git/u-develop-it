const express = require("express");
const router = express.Router();
router.use(require("./candidatesRoutes"));
router.use(require("./partyRouters"));
router.use(require("./voterRoutes"));
router.use(require("./voteRoutes"));
module.exports = router;
