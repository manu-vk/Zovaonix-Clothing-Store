

// const productModel = require("../model/productModel")

// const getProduct = async (req, res) => {
//     try {
//         const products = await productModel.find();
//         res.json(products);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Error fetching products" });
//     }
// };

// const addProduct = async (req, res) => {
//     try {

//         const images = req.files ? req.files.map(file => file.filename) : [];
//         const product = await productModel.create({
//             ...req.body,
//             image: images
//         });

//         res.status(201).json(product);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }
// const deleteProduct = async (req, res) => {
//     await productModel.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product Deleted" })
// }

// const updateProduct = async (req, res) => {
//     const { id } = req.params;

//     const updatedProduct = await productModel.findByIdAndUpdate(
//         id,
//         req.body,
//         { new: true }
//     );

//     res.json(updatedProduct);
// };

// module.exports = { getProduct, addProduct, deleteProduct, updateProduct }

const productModel = require("../model/productModel");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "fragranzia/products",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(fileBuffer);
    });
};

const getProduct = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching products",
        });
    }
};


const addProduct = async (req, res) => {
    try {
        const sizes = req.body.sizes
            ? JSON.parse(req.body.sizes)
            : ["S", "M", "L", "XL", "XXL"];

        const images = req.files
            ? await Promise.all(
                req.files.map(async (file) => {
                    const result = await uploadToCloudinary(file.buffer);
                    return result.secure_url;
                })
            )
            : [];

        const product = await productModel.create({
            ...req.body,
            isLimitedEdition: req.body.isLimitedEdition === "true",
            sizes,
            image: images,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product Deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = {
            ...req.body,
        };
        if (req.body.isLimitedEdition !== undefined) {
            updateData.isLimitedEdition =
                req.body.isLimitedEdition === "true";
        }
        if (req.body.sizes) {
            updateData.sizes = JSON.parse(req.body.sizes);
        }

        if (req.files && req.files.length > 0) {
            const images = await Promise.all(
                req.files.map(async (file) => {
                    const result = await uploadToCloudinary(file.buffer);
                    return result.secure_url;
                })
            );

            updateData.image = images;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getProduct,
    addProduct,
    deleteProduct,
    updateProduct,
};