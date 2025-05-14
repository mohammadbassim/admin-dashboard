import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

function VendorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', priceInSYP: '', costPrice: '', imageUrl: '' });
    const [editId, setEditId] = useState(null);
    const [percentageChange, setPercentageChange] = useState('');

    useEffect(() => {
        fetchVendor();
        fetchProducts();
    }, [id]);

    const fetchVendor = async () => {
        const res = await api.get(`/Vendor/${id}`);
        setVendor(res.data);
    };

    const fetchProducts = async () => {
        const res = await api.get(`/vendors/${id}/products`);
        setProducts(res.data || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: form.name,
            priceInSYP: parseFloat(form.priceInSYP),
            costPrice: parseFloat(form.costPrice),
            imageUrl: form.imageUrl
        };

        try {
            if (editId) {
                await api.put(`/vendors/${id}/products/${editId}`, payload);
            } else {
                await api.post(`/vendors/${id}/products`, payload);
            }
            setForm({ name: '', priceInSYP: '', costPrice: '', imageUrl: '' });
            setEditId(null);
            fetchProducts();
        } catch {
            alert('فشل في حفظ المنتج');
        }
    };

    const handleEdit = (product) => {
        setForm({
            name: product.name,
            priceInSYP: product.priceInSYP,
            costPrice: product.costPrice,
            imageUrl: product.imageUrl
        });
        setEditId(product.id);
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
                await api.delete(`/vendors/${id}/products/${productId}`);
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

    return (
        <div>
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/dashboard/vendors')}>
                ← الرجوع لقائمة البائعين
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteVendor}>
                🗑️ حذف
            </button>

            {vendor && (
                <div className="mb-4">
                    <h3>{vendor.name}</h3>
                    <p>الموقع: {vendor.location}</p>
                    <p>الفئة: {vendor.vendorCategory?.name}</p>

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
                        className="form-control mb-2"
                        placeholder="رابط الصورة"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
                                    {vendor.dollarExchangeRate > 0
                                        ? (p.priceInSYP / vendor.dollarExchangeRate).toFixed(2)
                                        : '—'}
                                </td>
                                <td>
                                    {p.imageUrl && (
                                        <img
                                            src={p.imageUrl}
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
