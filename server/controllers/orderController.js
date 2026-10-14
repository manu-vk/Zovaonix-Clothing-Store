const orderModel = require("../model/orderModel");
const User = require("../model/userModel");
const crypto = require("crypto");


const razorpay = require("../utils/razerpay");

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, address, phone, orderId, currency = "INR"

        } = req.body;
        // const { paymentMethod, currency = "INR" } = req.body;
        const userId = req.user.id;

        console.log("Order creation request:", {
            userId,
            itemsCount: items?.length,
            totalAmount,
            paymentMethod,
            itemsData: items
        });

        if (!userId) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        if (!items) {
            return res.status(400).json({ message: "Missing required field: items" });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item" });
        }

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({ message: "Missing required field: totalAmount must be greater than 0" });
        }

        // Validate each item has required fields
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.productId || !item.name || !item.price || !item.quantity) {
                console.error(`Item ${i} missing fields:`, item);
                return res.status(400).json({
                    message: `Item ${i} missing required fields: productId, name, price, quantity`
                });
            }
        }
        if (!address || !phone || !orderId) {
            return res.status(400).json({
                message: "Missing required fields: address, phone, orderId"
            });
        }


        const order = await orderModel.create({
            userId,
            items,
            totalAmount,
            paymentMethod: paymentMethod || "Cash on Delivery",
            address,
            phone,
            orderId,
            status: "pending"
        });

        let razorpayOrder = null;

        // Create one Razorpay order if payment is not COD

        if (
            paymentMethod !== "COD" &&
            paymentMethod !== "Cash on Delivery"
        ) {
            const options = {
                amount: totalAmount * 100, // in paise
                currency,
                receipt: `receipt_${order._id}`,
            };


            razorpayOrder = await razorpay.orders.create(options);


            if (!razorpayOrder) {
                return res
                    .status(500)
                    .json({ message: "Razorpay order creation failed" });
            }
        }

        console.log("Order created successfully:", order._id);

        res.status(201).json({
            message: "Order created successfully", order,
            razorpayOrder: razorpayOrder || null, paymentMethod
        });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: error.message });
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

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "return_requested",
            "returned"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await orderModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Signature is valid. Mark the matching order as paid.
    const order = await orderModel.findOne({
      orderId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = "confirmed";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
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
