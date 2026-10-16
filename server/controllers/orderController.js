const orderModel = require("../model/orderModel");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const Product = require("../model/productModel");
const crypto = require("crypto");


const razorpay = require("../utils/razerpay");

const createOrder = async (req, res) => {
    let order = null;

    try {
        const { items, paymentMethod, address, phone, orderId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }

        // Backend must enforce UPI-only checkout.
        if (!["UPI", "COD", "Cash on Delivery"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method",
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one item",
            });
        }

        if (!address?.trim() || !phone?.trim() || !orderId?.trim()) {
            return res.status(400).json({
                message: "Address, phone and orderId are required",
            });
        }

        // Validate quantities and product IDs before querying MongoDB.
        for (const item of items) {
            if (
                !item.productId ||
                !mongoose.isValidObjectId(item.productId) ||
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) < 1
            ) {
                return res.status(400).json({
                    message: "Each item must have a valid productId and quantity",
                });
            }
        }

        // Prevent duplicate client order IDs.
        const existingOrder = await orderModel.findOne({ orderId });
        if (existingOrder) {
            return res.status(409).json({
                message: "This orderId has already been used",
            });
        }

        // Fetch trusted product information from the database.
        const productIds = [
            ...new Set(items.map((item) => item.productId.toString())),
        ];

        const products = await Product.find({
            _id: { $in: productIds },
        });

        const productMap = new Map(
            products.map((product) => [product._id.toString(), product])
        );

        let calculatedTotal = 0;
        const verifiedItems = [];

        for (const item of items) {
            const product = productMap.get(item.productId.toString());
            const quantity = Number(item.quantity);

            if (!product) {
                return res.status(400).json({
                    message: `Product not found: ${item.productId}`,
                });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.title}`,
                });
            }

            // Use offerPrice as the checkout price.
            const unitPrice = Number(product.offerPrice);

            if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
                return res.status(400).json({
                    message: `Invalid price for ${product.title}`,
                });
            }

            calculatedTotal += unitPrice * quantity;

            console.log("ORDER ITEM SIZE:", item.size);
            verifiedItems.push({
                productId: product._id,
                name: product.title,
                price: unitPrice,
                image: product.image?.[0] || "",
                description: product.description,
                quantity,
                size: item.size || null,
            });

        }

        calculatedTotal = Number(calculatedTotal.toFixed(2));

        if (!Number.isFinite(calculatedTotal) || calculatedTotal <= 0) {
            return res.status(400).json({
                message: "Invalid order total",
            });
        }

        // Never use the frontend's totalAmount or item prices.
        order = await orderModel.create({
            userId,
            items: verifiedItems,
            totalAmount: calculatedTotal,
            paymentMethod:
                paymentMethod === "UPI" ? "UPI" : "Cash on Delivery",
            address: address.trim(),
            phone: phone.trim(),
            orderId: orderId.trim(),
            status: "pending",
            paymentStatus: "pending",
        });
        // COD orders do not require Razorpay.
        if (paymentMethod !== "UPI") {
            return res.status(201).json({
                message: "COD order created successfully",
                order,
                paymentMethod: "COD",
            });
        }
        // Create the Razorpay order using the server-calculated total.
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(calculatedTotal * 100),
            currency: "INR",
            receipt: `receipt_${order._id}`,
        });

        if (!razorpayOrder?.id) {
            throw new Error("Razorpay order creation failed");
        }

        // Save the Razorpay order ID for secure payment verification.
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(201).json({
            message: "Order created successfully",
            order,
            razorpayOrder,
            paymentMethod: "UPI",
        });
    } catch (error) {
        console.error("Order creation error:", error.message);

        // Avoid leaving an unusable pending order if Razorpay creation fails.
        if (order?._id) {
            try {
                await orderModel.deleteOne({
                    _id: order._id,
                    paymentStatus: "pending",
                    status: "pending",
                });
            } catch (cleanupError) {
                console.error("Order cleanup failed:", cleanupError.message);
            }
        }

        return res.status(500).json({
            message: "Unable to create payment order",
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await orderModel
            .findById(req.params.id)
            .populate("userId", "name email")
            .populate("items.productId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find()
            .populate("userId", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const updateOrderStatus = async (req, res) => {
//     try {
//         const { status } = req.body;
//         const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "return_requested",
//             "returned", "return_approved",
//             "return_rejected"];

//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ message: "Invalid status" });
//         }

//         const order = await orderModel.findByIdAndUpdate(
//             req.params.id,
//             { status },
//             { new: true }
//         );

//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         res.status(200).json({ message: "Order status updated", order });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "return_requested",
            "returned",
            "return_approved",
            "return_rejected"
        ];
        console.log("Received status:", status);
        console.log("Valid statuses:", validStatuses);
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Return decisions are allowed only for requested returns
        if (
            status === "return_approved" ||
            status === "return_rejected"
        ) {
            if (order.status !== "return_requested") {
                return res.status(400).json({
                    message: "This order has no pending return request"
                });
            }
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: "Order status updated",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await orderModel.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const cancelOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        if (
            order.status === "shipped" ||
            order.status === "delivered"
        ) {
            return res.status(400).json({
                message: "This order cannot be cancelled"
            });
        }

        order.status = "cancelled";
        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const returnOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        if (order.status !== "delivered") {
            return res.status(400).json({
                message: "Only delivered orders can be returned"
            });
        }

        order.status = "return_requested";
        await order.save();

        res.status(200).json({
            message: "Return request submitted",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !orderId
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification details",
            });
        }

        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await orderModel.findOne({
            _id: orderId,
            userId: req.user.id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Confirm the Razorpay ID matches the one saved by the backend.
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order ID does not match",
            });
        }

        // Make repeat verification safe.
        if (order.paymentStatus === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
            });
        }

        if (order.paymentMethod !== "UPI") {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            console.error("RAZORPAY_KEY_SECRET is not configured");
            return res.status(500).json({
                success: false,
                message: "Payment verification is unavailable",
            });
        }

        // Verify signature using the server-stored Razorpay order ID.
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
            .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(razorpay_signature, "hex");

        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        // Confirm the payment's actual status with Razorpay.
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (
            payment.order_id !== order.razorpayOrderId ||
            payment.status !== "captured" ||
            payment.amount !== Math.round(order.totalAmount * 100) ||
            payment.currency !== "INR"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment is not captured or payment details do not match",
            });
        }

        order.razorpayPaymentId = razorpay_payment_id;
        order.paymentStatus = "paid";
        order.status = "confirmed";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
        });
    } catch (error) {
        console.error("Payment verification error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};


module.exports = {
    createOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    cancelOrder,
    returnOrder,
    verifyPayment,
};
