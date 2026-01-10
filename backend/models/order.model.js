import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		// Payment Gateway Session IDs
		stripeSessionId: {
			type: String,
			sparse: true, // Allows multiple null values
		},
		sslCommerzTransactionId: {
			type: String,
			sparse: true, // Allows multiple null values
		},
		// Payment Status
		paymentStatus: {
			type: String,
			enum: ['pending', 'paid', 'failed', 'cancelled'],
			default: 'pending',
		},
		// Payment Gateway Used
		paymentGateway: {
			type: String,
			enum: ['stripe', 'sslcommerz', 'cod'],
			default: 'sslcommerz',
		},
		// Customer Details (required by SSLCommerz)
		customerName: {
			type: String,
		},
		customerEmail: {
			type: String,
		},
		customerPhone: {
			type: String,
		},
		customerAddress: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;