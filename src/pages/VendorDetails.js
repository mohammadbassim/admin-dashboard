import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

function VendorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [vendorImage, setVendorImage] = useState(''); // used in JSX, keep as is
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', priceInSYP: '', costPrice: '', imageFile: null, selectedCategoryId: '', categoryName: '', categoryImageFile: null });
    const [editId, setEditId] = useState(null);
    const [percentageChange, setPercentageChange] = useState('');
    const [editVendorForm, setEditVendorForm] = useState({ name: '', location: '', dollarExchangeRate: '', vendorCategoryId: '', imageFile: null });
    const [categories, setCategories] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [showEditVendor, setShowEditVendor] = useState(false);

    // --- Product Category Edit/Delete ---
    const [catEditId, setCatEditId] = useState(null);
    const [catEditForm, setCatEditForm] = useState({ name: '', imageUrl: '', imageFile: null });

    useEffect(() => {
        fetchVendor();
        fetchProducts();
        fetchCategories();
        fetchProductCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchVendor = async () => {
        const res = await api.get(`/Vendor/${id}`);
        setVendor(res.data);
        setVendorImage(res.data.imageUrl || '');
    };    const fetchProducts = async () => {
        const res = await api.get(`/vendors/${id}/products`);
        setProducts(res.data || []);
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/VendorCategory');
            setCategories(res.data);
        } catch {
            setCategories([]);
        }
    };

    const fetchProductCategories = async () => {
        try {
            const res = await api.get('/ProductCategory');
            setProductCategories(res.data || []);
        } catch (error) {
            console.error('Error fetching product categories:', error);
            setProductCategories([]);
        }
    };

    // --- Product Form ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('priceInSYP', form.priceInSYP);
        formData.append('costPrice', form.costPrice);
        if (form.imageFile) formData.append('image', form.imageFile);
        // Category logic
        if (form.selectedCategoryId === 'new') {
            if (form.categoryName) formData.append('categoryName', form.categoryName);
            if (form.categoryImageFile) formData.append('categoryImage', form.categoryImageFile);
            if (id) formData.append('vendorId', id); // <-- Always provide vendorId for new category
        } else if (form.selectedCategoryId) {
            formData.append('productCategoryId', form.selectedCategoryId);
        }
        try {
            if (editId) {
                await api.put(`/vendors/${id}/products/${editId}/with-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/vendors/${id}/products/with-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setForm({ name: '', priceInSYP: '', costPrice: '', imageFile: null, selectedCategoryId: '', categoryName: '', categoryImageFile: null });
            setEditId(null);
            fetchProducts();
            if (document.getElementById('product-image-input')) {
                document.getElementById('product-image-input').value = '';
            }
            if (document.getElementById('category-image-input')) {
                document.getElementById('category-image-input').value = '';
            }
        } catch {
            alert('فشل في حفظ المنتج');
        }
    };

    const handleEdit = (product) => {
        setForm({
            name: product.name,
            priceInSYP: product.priceInSYP,
            costPrice: product.costPrice,
            imageFile: null // User must re-select image if changing
        });
        setEditId(product.id);
        // Reset file input value
        const fileInput = document.getElementById('product-image-input');
        if (fileInput) fileInput.value = '';
    };

    const handleDeleteVendor = async () => {
        if (window.confirm('هل أنت متأكد من حذف البائع؟')) {
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/Vendor/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                alert('تم حذف البائع بنجاح');
                navigate('/dashboard/vendors');
            } catch (err) {
                console.error(err);
                alert('فشل في حذف البائع');
            }
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('هل تريد حذف هذا المنتج؟')) {
            try {
                await api.delete(`/vendors/${id}/products/${productId}`); // fixed endpoint
                fetchProducts();
            } catch {
                alert('فشل في حذف المنتج');
            }
        }
    };

    const handleMassPriceUpdate = async () => {
        const percentage = parseFloat(percentageChange);
        if (isNaN(percentage)) {
            alert('الرجاء إدخال نسبة مئوية صحيحة');
            return;
        }
        try {
            await api.put(`Vendor/${id}/update-product-prices`, { percentage });
            alert('تم تحديث الأسعار بنجاح');
            fetchProducts();
        } catch (err) {
            console.error('Price update error:', err.response?.data || err);
            alert('فشل في تحديث الأسعار');
        }
    };

    const openEditVendor = () => {
        if (vendor) {
            setEditVendorForm({
                name: vendor.name || '',
                location: vendor.location || '',
                dollarExchangeRate: vendor.dollarExchangeRate || '',
                vendorCategoryId: vendor.vendorCategoryId || '',
                imageFile: null
            });
            setShowEditVendor(true);
        }
    };

    const handleEditVendorChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imageFile') {
            setEditVendorForm(f => ({ ...f, imageFile: files[0] }));
        } else {
            setEditVendorForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleEditVendorSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editVendorForm.name);
        formData.append('location', editVendorForm.location);
        formData.append('dollarExchangeRate', editVendorForm.dollarExchangeRate);
        formData.append('vendorCategoryId', editVendorForm.vendorCategoryId);
        if (editVendorForm.imageFile) formData.append('image', editVendorForm.imageFile);
        try {
            await api.put(`/Vendor/${id}/with-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowEditVendor(false);
            fetchVendor();
        } catch {
            alert('فشل في تعديل بيانات البائع');
        }
    };

    // Helper to get full image URL
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        // Use your API base URL for all relative paths
        return 'http://45.149.207.65:5000' + url;
    };

    // --- Product Category Edit/Delete ---
    const handleCatEdit = (cat) => {
        setCatEditId(cat.id);
        setCatEditForm({ name: cat.name, imageUrl: cat.imageUrl, imageFile: null });
    };

    const handleCatDelete = async (id) => {
        if (window.confirm('هل تريد حذف الفئة؟')) {
            try {
                await api.delete(`/ProductCategory/${id}`);
                setCatEditId(null);
                setCatEditForm({ name: '', imageUrl: '', imageFile: null });
                fetchProductCategories();
            } catch {
                alert('فشل في حذف الفئة');
            }
        }
    };

    const handleCatEditImageChange = async (e) => {
        const file = e.target.files[0];
        setCatEditForm(f => ({ ...f, imageFile: file }));
        if (!file) return;
        const formData = new FormData();
        formData.append('Image', file);
        try {
            const res = await api.post('/Upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCatEditForm(f => ({ ...f, imageUrl: res.data.url || res.data.imageUrl }));
        } catch {
            alert('فشل رفع الصورة');
        }
    };

    const handleCatEditSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = catEditForm.imageUrl;
        if (catEditForm.imageFile && !catEditForm.imageUrl) {
            const formData = new FormData();
            formData.append('Image', catEditForm.imageFile);
            const res = await api.post('/Upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            imageUrl = res.data.url || res.data.imageUrl;
        }
        try {
            await api.put(`/ProductCategory/${catEditId}`, {
                name: catEditForm.name,
                imageUrl,
                vendorId: id
            });
            setCatEditId(null);
            setCatEditForm({ name: '', imageUrl: '', imageFile: null });
            fetchProductCategories();
        } catch {
            alert('فشل في تعديل الفئة');
        }
    };

    return (
        <div>
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/dashboard/vendors')}>
                ← الرجوع لقائمة البائعين
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteVendor}>
                🗑️ حذف
            </button>

            {/* Edit Vendor Modal or Section */}
            {showEditVendor && (
                <form className="mb-4 p-3 border rounded" onSubmit={handleEditVendorSubmit} style={{ background: '#f9f9f9' }}>
                    <h5 className="mb-3">تعديل بيانات البائع</h5>
                    <div className="row">
                        <div className="col-md-3">
                            <input
                                className="form-control mb-2"
                                name="name"
                                placeholder="اسم البائع"
                                value={editVendorForm.name}
                                onChange={handleEditVendorChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                className="form-control mb-2"
                                name="location"
                                placeholder="الموقع"
                                value={editVendorForm.location}
                                onChange={handleEditVendorChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="number"
                                className="form-control mb-2"
                                name="dollarExchangeRate"
                                placeholder="سعر صرف الدولار"
                                value={editVendorForm.dollarExchangeRate}
                                onChange={handleEditVendorChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-control mb-2"
                                name="vendorCategoryId"
                                value={editVendorForm.vendorCategoryId}
                                onChange={handleEditVendorChange}
                                required
                            >
                                <option value="">اختر الفئة</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control mb-2"
                                name="imageFile"
                                onChange={handleEditVendorChange}
                            />
                            {/* Show current image if exists */}
                            {vendor && vendor.imageUrl && (
                                <img
                                    src={getImageUrl(vendor.imageUrl)}
                                    alt="Vendor"
                                    style={{ width: 80, marginTop: 5, borderRadius: 6 }}
                                />
                            )}
                        </div>
                    </div>
                    <button className="btn btn-success me-2" type="submit">حفظ التعديلات</button>
                    <button className="btn btn-secondary" type="button" onClick={() => setShowEditVendor(false)}>إلغاء</button>
                </form>
            )}

            {vendor && (
                <div className="mb-4">
                    <h3>{vendor.name}</h3>
                    <p>الموقع: {vendor.location}</p>
                    <p>الفئة: {vendor.vendorCategory?.name}</p>
                    {vendor.imageUrl && (
                        <div style={{ maxWidth: 300 }}>
                            <label className="form-label">صورة البائع</label>
                            <img
                                src={getImageUrl(vendor.imageUrl)}
                                alt="Vendor"
                                style={{ width: 200, marginTop: 10,marginBottom:15, borderRadius: 8, display: 'block' }}
                            />
                        </div>
                    )}

                    <div className="input-group mb-3" style={{ maxWidth: '300px' }}>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="نسبة التعديل (مثال: -5 أو 10)"
                            value={percentageChange}
                            onChange={(e) => setPercentageChange(e.target.value)}
                        />
                        <button className="btn btn-warning" onClick={handleMassPriceUpdate}>
                            تحديث الأسعار
                        </button>
                    </div>

                    {/* Add an edit button near vendor info */}
                    <button className="btn btn-primary btn-sm mb-2" onClick={openEditVendor}>تعديل بيانات البائع</button>
                </div>
            )}

            {/* Add Category Form */}
            <h5 className="mb-3">إضافة فئة منتج</h5>
            {catEditId ? (
                <form onSubmit={handleCatEditSubmit} className="row mb-4">
                    <div className="col-md-3">
                        <input
                            className="form-control mb-2"
                            placeholder="اسم الفئة"
                            value={catEditForm.name}
                            onChange={e => setCatEditForm(f => ({ ...f, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control mb-2"
                            onChange={handleCatEditImageChange}
                        />
                        {catEditForm.imageUrl && (
                            <img src={getImageUrl(catEditForm.imageUrl)} alt="تصوير" style={{ maxWidth: 80, maxHeight: 80, marginTop: 8 }} />
                        )}
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-success">تعديل</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => { setCatEditId(null); setCatEditForm({ name: '', imageUrl: '', imageFile: null }); }}>إلغاء</button>
                    </div>
                </form>
            ) : (
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        let imageUrl = '';
                        if (form.categoryImageFile) {
                            const imgFormData = new FormData();
                            imgFormData.append('Image', form.categoryImageFile);
                            try {
                                const res = await api.post('/Upload', imgFormData, {
                                    headers: { 'Content-Type': 'multipart/form-data' }
                                });
                                imageUrl = res.data.url || res.data.imageUrl;
                            } catch {
                                alert('فشل رفع الصورة');
                                return;
                            }
                        }
                        try {
                            await api.post('/ProductCategory', {
                                name: form.categoryName,
                                imageUrl,
                                vendorId: id
                            });
                            setForm(f => ({ ...f, categoryName: '', categoryImageFile: null }));
                            if (document.getElementById('category-image-input')) {
                                document.getElementById('category-image-input').value = '';
                            }
                            fetchProductCategories();
                        } catch {
                            alert('فشل في إضافة الفئة');
                        }
                    }}
                    className="row mb-4"
                >
                    <div className="col-md-3">
                        <input
                            className="form-control mb-2"
                            placeholder="اسم الفئة"
                            value={form.categoryName || ''}
                            onChange={e => setForm(f => ({ ...f, categoryName: e.target.value }))
                            }
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control mb-2"
                            id="category-image-input"
                            onChange={e => setForm(f => ({ ...f, categoryImageFile: e.target.files[0] }))
                            }
                        />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary">إضافة الفئة</button>
                    </div>
                </form>            )}

            {/* Product Category List with Edit/Delete */}
            <h5 className="mb-3">  قائمة الفئات</h5>
            <table className="table table-bordered text-center mb-4">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>الصورة</th>
                        <th>الخيارات</th>
                    </tr>
                </thead>
                <tbody>
                    {productCategories.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.imageUrl && (
                                <img src={getImageUrl(c.imageUrl)} alt="تصوير" style={{ maxWidth: 60, maxHeight: 60 }} />
                            )}</td>
                            <td>
                                <button className="btn btn-sm btn-primary me-2" onClick={() => handleCatEdit(c)}>تعديل</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleCatDelete(c.id)}>حذف</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Product Add/Edit Form */}
            <h5 className="mb-3">{editId ? 'تعديل منتج' : 'إضافة منتج'}</h5>
            <form onSubmit={handleSubmit} className="row mb-4">
                <div className="col-md-3">
                    <input
                        className="form-control mb-2"
                        placeholder="اسم المنتج"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="السعر (ل.س)"
                        value={form.priceInSYP}
                        onChange={e => setForm(f => ({ ...f, priceInSYP: e.target.value }))}
                        required
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="سعر التكلفة"
                        value={form.costPrice}
                        onChange={e => setForm(f => ({ ...f, costPrice: e.target.value }))}
                    />
                </div>
                <div className="col-md-2">
                    <select
                        className="form-control mb-2"
                        value={form.selectedCategoryId}
                        onChange={e => setForm(f => ({ ...f, selectedCategoryId: e.target.value }))}
                        required
                    >
                        <option value="">اختر فئة المنتج</option>
                        {productCategories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2">
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control mb-2"
                        id="product-image-input"
                        onChange={e => setForm(f => ({ ...f, imageFile: e.target.files[0] }))}
                    />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                    <button className="btn btn-success w-100" type="submit">{editId ? 'حفظ' : 'إضافة'}</button>
                </div>
                {editId && (
                    <div className="col-md-1 d-flex align-items-end">
                        <button type="button" className="btn btn-secondary w-100" onClick={() => { setEditId(null); setForm({ name: '', priceInSYP: '', costPrice: '', imageFile: null, selectedCategoryId: '', categoryName: '', categoryImageFile: null }); }}>إلغاء</button>
                    </div>
                )}
            </form>

            <h5>قائمة المنتجات</h5> 
            <table className="table table-bordered text-center">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>السعر (ل.س)</th>
                        <th>سعر التكلفة</th>
                        <th>سعر الدولار</th>
                        <th>صورة</th>
                        <th>الفئة (اسم وصورة)</th>
                        <th>خيارات</th>
                    </tr>
                </thead>
                <tbody>
                    {vendor && products.length === 0 ? (
                        <tr>
                            <td colSpan="8">لا توجد منتجات</td>
                        </tr>
                    ) : (
                        products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.priceInSYP.toFixed(0)}</td>
                                <td>{p.costPrice?.toFixed(0) || '—'}</td>
                                <td>
                                    {vendor && vendor.dollarExchangeRate > 0
                                        ? (p.priceInSYP / vendor.dollarExchangeRate).toFixed(2)
                                        : '—'}
                                </td>
                                <td>
                                    {p.imageUrl && (
                                        <img
                                            src={getImageUrl(p.imageUrl)}
                                            alt={p.name}
                                            style={{ width: 60, height: 'auto', borderRadius: 4 }}
                                        />
                                    )}
                                </td>                                {/* Combine category name and image in one column */}
                                <td>
                                    {p.productCategory?.imageUrl && (
                                        <img
                                            src={getImageUrl(p.productCategory.imageUrl)}
                                            alt={p.productCategory?.name}
                                            style={{ width: 40, height: 40, borderRadius: '50%', marginLeft: 6, marginRight: 6 }}
                                        />
                                    )}
                                    {p.productCategory?.name || '—'}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(p)}
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteProduct(p.id)}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default VendorDetails;
