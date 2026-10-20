import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useEffect } from 'react';

const AdminProducts = () => {

    //addProduct, updateProducts, deleteProduct work not completed
    const { products, addProduct, updateProduct, deleteProduct, API_PRODUCT, productCount, categories } = useContext(AppContext);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        offerPrice: '',
        category: '',
        brand: '',
        rating: '',
        ratingCount: '',
        image: ['', '', ''],
        description: '',
        stock: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'],
    });

    // const categories = ['Eau De Parfum', 'Concentrated', 'Deodorants', 'Body Mist', 'Combo'];

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    const handleSizeChange = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];

        if (file) {
            const newImages = [...formData.image];
            newImages[index] = file;

            const preview = URL.createObjectURL(file);

            setFormData(prev => ({
                ...prev,
                image: newImages,
                [`preview${index}`]: preview
            }));
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const data = new FormData();

        data.append("title", formData.title);
        data.append("brand", formData.brand);
        data.append("category", formData.category);
        data.append("price", formData.price);
        data.append("offerPrice", formData.offerPrice);
        data.append("stock", formData.stock);
        data.append("sizes", JSON.stringify(formData.sizes));
        data.append("description", formData.description);
        data.append("rating", formData.rating);
        data.append("ratingCount", formData.ratingCount);
        data.append("isLimitedEdition", String(formData.isLimitedEdition));

        formData.image.forEach(img => {
            if (img) data.append("image", img)
        });

        if (editingProduct) {
            await updateProduct(editingProduct._id, data);
            handleReset();
        } else {
            await addProduct(data);
            handleReset();
        }

    }

    // const handleEdit = (product) => {

    //     setEditingProduct(product);
    //     setFormData({
    //         title: product.title,
    //         price: product.price,
    //         offerPrice: product.offerPrice,
    //         category: product.category,
    //         brand: product.brand,
    //         rating: product.rating,
    //         ratingCount: product.ratingCount,
    //         stock: product.stock,
    //         description: product.description || '',
    //         sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
    //         // image: [...product.image]
    //     });
    //     setShowAddForm(true);
    // };
    const handleEdit = (product) => {
        setEditingProduct(product);

        setFormData({
            title: product.title || '',
            price: product.price ?? '',
            offerPrice: product.offerPrice ?? '',
            category: product.category?._id || product.category || '',
            brand: product.brand || '',
            rating: product.rating ?? '',
            ratingCount: product.ratingCount ?? '',
            stock: product.stock ?? '',
            description: product.description || '',
            sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
            isLimitedEdition: product.isLimitedEdition ?? false,
            image: [...product.image],
        });

        setShowAddForm(true);
    };

    const handleDelete = (id) => {
        deleteProduct(id);
    };

    const handleReset = () => {
        setFormData({
            title: '',
            price: '',
            offerPrice: '',
            category: '',
            brand: '',
            rating: '',
            ratingCount: '',
            image: ['', '', ''],
            description: '',
            stock: '',
            sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'],
            isLimitedEdition: false,
        });
        setEditingProduct(null);
        setShowAddForm(false);
    };

    useEffect(() => {
        console.log("products count", productCount);
    }, [productCount])

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">

            <div className="mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    Products Management
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600">
                    Manage your product inventory and details
                </p>
            </div>

            <div className="mb-5 rounded-lg bg-white p-3 sm:p-4 shadow">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 sm:px-4">
                            Export
                        </button>
                        <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 sm:px-4">
                            Import
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dull sm:w-auto"
                    >
                        {showAddForm ? 'Close Form' : 'Add Product'}
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className="mb-6 rounded-lg bg-white p-3 shadow sm:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <button onClick={handleReset} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Product Name *</label>
                                <input id="title" value={formData.title} onChange={handleInputChange} type="text" placeholder="Product name" className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Brand *</label>
                                <input id="brand" value={formData.brand} onChange={handleInputChange} type="text" placeholder="Brand name" className="w-full p-2 border rounded" required />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Product description"
                                className="w-full p-2 border rounded"
                                rows="4"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Category *</label>
                            <select id="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded" required>
                                <option value="">Select category</option>
                                {/* {categories?.map((cat, idx) => <option key={idx} value={cat.toLowerCase()}>{cat}</option>)} */}
                                {categories?.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.categoryname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                                <input id="price" value={formData.price} onChange={handleInputChange} type="number" placeholder="Price" className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Offer Price (₹)</label>
                                <input id="offerPrice" value={formData.offerPrice} onChange={handleInputChange} type="number" placeholder="Offer price" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Stock</label>
                                <input id="stock" value={formData.stock} onChange={handleInputChange} type="number" placeholder="Stock" className="w-full p-2 border rounded" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Rating</label>
                                <input id="rating" value={formData.rating} onChange={handleInputChange} type="number" step="0.1" max="5" placeholder="Rating" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Rating Count</label>
                                <input id="ratingCount" value={formData.ratingCount} onChange={handleInputChange} type="number" placeholder="Rating count" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Available Sizes *
                                </label>

                                <div className="flex flex-wrap gap-3">
                                    {['S', 'M', 'L', 'XL', 'XXL','3XL', 'Free Size'].map(size => (
                                        <label
                                            key={size}
                                            className={`flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer ${formData.sizes.includes(size)
                                                ? 'border-primary bg-pink-50'
                                                : 'border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.sizes.includes(size)}
                                                onChange={() => handleSizeChange(size)}
                                            />
                                            <span>{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* Limited Edition */}
                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    id="isLimitedEdition"
                                    type="checkbox"
                                    checked={formData.isLimitedEdition}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            isLimitedEdition: e.target.checked
                                        }))
                                    }
                                />
                                <label htmlFor="isLimitedEdition">
                                    Limited Edition
                                </label>
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Product Images</label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {[0, 1, 2].map((idx) => (
                                    <div key={idx} className="border-2 border-dashed rounded p-2">
                                        <label className="cursor-pointer block">
                                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(idx, e)} className="hidden" />
                                            {formData.image[idx] ? (
                                                <img src={formData.image[idx]} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded" />
                                            ) : (
                                                <div className="w-full h-24 flex items-center justify-center text-gray-400">Click to upload</div>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary-dull sm:w-auto"
                            >
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full rounded-lg border px-6 py-2 hover:bg-gray-50 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

        
<div className="w-full overflow-x-auto rounded-lg bg-white shadow">
    <div className="min-w-[900px]">

        {/* Table heading */}
        <div className="grid grid-cols-[70px_2fr_1fr_90px_90px_70px_2fr_130px] items-center gap-2 border-b bg-gray-50 p-3 text-sm font-semibold">
            <div>Image</div>
            <div>Product</div>
            <div>Category</div>
            <div>Price</div>
            <div>Offer</div>
            <div>Stock</div>
            <div>Description</div>
            <div>Actions</div>
        </div>

        {/* Product rows */}
        <div className="lg:max-h-[500px] lg:overflow-y-auto">
            {products.map((product) => (
                <div
                    key={product._id}
                    className="grid grid-cols-[70px_2fr_1fr_90px_90px_70px_2fr_130px] items-center gap-2 border-b p-3 text-sm hover:bg-gray-50"
                >
                    <div>
                        <img
                            src={product.image?.[0]}
                            alt={product.title}
                            className="h-12 w-12 rounded object-cover"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-medium">{product.title}</p>
                        <p className="truncate text-gray-500">{product.brand}</p>
                    </div>

                    <div className="truncate">
                        {product.category?.categoryname || 'N/A'}
                    </div>

                    <div>₹{product.price}</div>
                    <div>₹{product.offerPrice}</div>
                    <div>{product.stock ?? 'N/A'}</div>

                    <div className="truncate">
                        {product.description || 'No description'}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(product)}
                            className="rounded bg-yellow-100 px-2 py-1 text-yellow-700 hover:bg-yellow-200"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(product._id)}
                            className="rounded bg-red-100 px-2 py-1 text-red-700 hover:bg-red-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>

        </div>
    );
};

export default AdminProducts;