import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

function VendorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [vendorImage, setVendorImage] = useState(''); // used in JSX, keep as is
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', priceInSYP: '', costPrice: '', imageFile: null });
    const [editId, setEditId] = useState(null);
    const [percentageChange, setPercentageChange] = useState('');
    const [editVendorForm, setEditVendorForm] = useState({ name: '', location: '', dollarExchangeRate: '', vendorCategoryId: '', imageFile: null });
    const [categories, setCategories] = useState([]);
    const [showEditVendor, setShowEditVendor] = useState(false);

    useEffect(() => {
        fetchVendor();
        fetchProducts();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchVendor = async () => {
        const res = await api.get(`/Vendor/${id}`);
        setVendor(res.data);
        setVendorImage(res.data.imageUrl || '');
    };

    const fetchProducts = async () => {
        const res = await api.get(`/Vendor/${id}/products`);
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

    // --- Product Form ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('priceInSYP', form.priceInSYP);
        formData.append('costPrice', form.costPrice);
        // Only append image if a new file is selected
        if (form.imageFile) formData.append('image', form.imageFile);
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
            setForm({ name: '', priceInSYP: '', costPrice: '', imageFile: null });
            setEditId(null);
            fetchProducts();
            // Reset file input manually
            if (document.getElementById('product-image-input')) {
                document.getElementById('product-image-input').value = '';
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
                                    src={`http://192.168.1.29:5010${vendor.imageUrl}`}
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
                                src={`http://192.168.1.29:5010${vendor.imageUrl}`}
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

            <h5 className="mb-3">{editId ? 'تعديل المنتج' : 'إضافة منتج'}</h5>
            <form onSubmit={handleSubmit} className="row mb-4">
                <div className="col-md-3">
                    <input
                        className="form-control mb-2"
                        placeholder="اسم المنتج"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="السعر بالليرة"
                        value={form.priceInSYP}
                        onChange={(e) => setForm({ ...form, priceInSYP: e.target.value })}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="سعر التكلفة"
                        value={form.costPrice}
                        onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control mb-2"
                        id="product-image-input"
                        onChange={e => setForm({ ...form, imageFile: e.target.files[0] })}
                        required={!editId}
                    />
                </div>
                <div className="col-12">
                    <button className="btn btn-success">{editId ? 'تحديث' : 'إضافة'}</button>
                </div>
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
                        <th>خيارات</th>
                    </tr>
                </thead>
                <tbody>
                    {vendor && products.length === 0 ? (
                        <tr>
                            <td colSpan="6">لا توجد منتجات</td>
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
                                            src={`http://192.168.1.29:5010${p.imageUrl}`}
                                            alt={p.name}
                                            style={{ width: 60, height: 'auto', borderRadius: 4 }}
                                        />
                                    )}
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
