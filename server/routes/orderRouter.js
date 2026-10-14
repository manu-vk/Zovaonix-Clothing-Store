const express = require('express');
const protect = require("../middleware/authMiddleware");
const {
    createOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    cancelOrder,
    returnOrder,
    verifyPayment,
} = require('../controllers/orderController');

const orderRouter = express.Router();

// User routes
orderRouter.post('/', protect, createOrder);
orderRouter.get('/user/orders', protect, getUserOrders);
orderRouter.get('/:id', protect, getOrderById);
orderRouter.put('/:id/cancel', protect, cancelOrder);
orderRouter.put('/:id/return', protect, returnOrder);
orderRouter.post("/payment/verify-payment", protect, verifyPayment);

// Admin routes
orderRouter.get('/', protect, getAllOrders);
orderRouter.put('/:id/status', protect, updateOrderStatus);
orderRouter.delete('/:id', protect, deleteOrder);

module.exports = orderRouter;
