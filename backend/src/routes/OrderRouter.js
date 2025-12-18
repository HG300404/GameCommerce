const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");


router.post("/create", orderController.createOrder);
router.get("/get-order-details/:id", orderController.getDetailsOrder);
router.get("/getAllOrder", orderController.getAllOrder);
router.post("/checkout-success", orderController.handleCheckoutSuccess);

module.exports = router;