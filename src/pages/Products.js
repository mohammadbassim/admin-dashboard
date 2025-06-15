import React, { useEffect, useState } from 'react';
import api from '../api/api';

function Products() {
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [form, setForm] = useState({
        name: '',
        priceInSYP: '',
        price1: '',
        productCategoryId: '',
        imageFile: null
    });
    const [editId, setEditId] = useState(null);
    const [categories, setCategories] = useState([]);

    // Category add form state
    const [catForm, setCatForm] = useState({ name: '', imageFile: null });
    const [catEditId, setCatEditId] = useState(null);

    useEffect(() => {
        fetchVendors();
        fetchCategories();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await api.get('/Vendor/categories');
            const allVendors = res.data.flatMap(c => c.vendors || []);
            setVendors(allVendors);
        } catch {
            alert('فشل تحميل البائعين');
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/ProductCategorie');
            setCategories(res.data);
        } catch {
            alert('فشل تحميل فئات المنتجات');
        }
    };

    const fetchProducts = async (vendorId) => {
        try {
            const res = await api.get(`/Vendor/${vendorId}/products`);
            setProducts(res.data || []);
        } catch {
            alert('فشل تحميل المنتجات');
        }
    };

    const handleVendorChange = (e) => {
        const id = e.target.value;
        setSelectedVendor(id);
        fetchProducts(id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('priceInSYP', form.priceInSYP);
        formData.append('costPrice', form.price1);
        formData.append('productCategoryId', form.productCategoryId);
        if (form.imageFile) formData.append('image', form.imageFile);
        try {
            if (editId) {
                await api.put(`/vendors/${selectedVendor}/products/${editId}/with-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/vendors/${selectedVendor}/products/with-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setForm({ name: '', priceInSYP: '', price1: '', productCategoryId: '', imageFile: null });
            setEditId(null);
            fetchProducts(selectedVendor);
        } catch {
            alert('خطأ في حفظ المنتج');
        }
    };

    const handleEdit = (p) => {
        setForm({ name: p.name, priceInSYP: p.priceInSYP, price1: p.costPrice, productCategoryId: p.productCategoryId });
        setEditId(p.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل تريد حذف المنتج؟')) {
            try {
                await api.delete(`/Vendor/${selectedVendor}/products/${id}`);
                fetchProducts(selectedVendor);
            } catch {
                alert('فشل في الحذف');
            }
        }
    };

    // Add category handler
    const handleCatSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', catForm.name);
        if (catForm.imageFile) formData.append('Image', catForm.imageFile);
        try {
            if (catEditId) {
                await api.put(`/ProductCategorie/${catEditId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/ProductCategorie', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setCatForm({ name: '', imageFile: null });
            setCatEditId(null);
            fetchCategories();
        } catch {
            alert('فشل حفظ الفئة');
        }
    };
    const handleCatEdit = (c) => {
        setCatForm({ name: c.name, imageFile: null });
        setCatEditId(c.id);
    };
    const handleCatDelete = async (id) => {
        if (window.confirm('هل تريد حذف الفئة؟')) {
            try {
                await api.delete(`/ProductCategorie/${id}`);
                fetchCategories();
            } catch {
                alert('فشل في حذف الفئة');
            }
        }
    };

    return (
        <div>
            <h4 className="mb-3">إدارة المنتجات</h4>
            {/* Category add section */}
            <div className="mb-4 p-3 border rounded" style={{ background: '#f9f9f9' }}>
                <h5 className="mb-3">إضافة/تعديل فئة منتج</h5>
                <form className="mb-3" onSubmit={handleCatSubmit} encType="multipart/form-data">
                    <div className="row">
                        <div className="col-md-4">
                            <input
                                className="form-control mb-2"
                                placeholder="اسم الفئة"
                                value={catForm.name}
                                onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control mb-2"
                                onChange={e => setCatForm({ ...catForm, imageFile: e.target.files[0] })}
                            />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-success">{catEditId ? 'تعديل' : 'إضافة'}</button>
                        </div>
                    </div>
                </form>
                <table className="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>الصورة</th>
                            <th>الخيارات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>{c.imageUrl && <img src={c.imageUrl.startsWith('/uploads/') ? `http://45.149.207.65:5000${c.imageUrl}` : c.imageUrl} alt="تصوير" style={{ maxWidth: 60, maxHeight: 60 }} />}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleCatEdit(c)}>تعديل</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleCatDelete(c.id)}>حذف</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Product management section */}
            <div>
                <h5 className="mb-3">إدارة المنتجات للبائع المحدد</h5>
                <div className="mb-3">
                    <select className="form-select" value={selectedVendor || ''} onChange={handleVendorChange}>
                        <option value="">اختر بائع</option>
                        {vendors.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                    </select>
                </div>
                {selectedVendor && (
                    <>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="row">
                                <div className="col-md-3">
                                    <input
                                        className="form-control mb-2"
                                        placeholder="اسم المنتج"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        placeholder="السعر (ل.س)"
                                        value={form.priceInSYP}
                                        onChange={e => setForm({ ...form, priceInSYP: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        placeholder="سعر التكلفة"
                                        value={form.price1}
                                        onChange={e => setForm({ ...form, price1: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-select mb-2"
                                        value={form.productCategoryId}
                                        onChange={e => setForm({ ...form, productCategoryId: e.target.value })}
                                    >
                                        <option value="">اختر فئة منتج</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-primary mb-2">{editId ? 'تحديث المنتج' : 'إضافة منتج'}</button>
                                </div>
                            </div>
                        </form>
                        <table className="table table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>اسم المنتج</th>
                                    <th>السعر (ل.س)</th>
                                    <th>سعر التكلفة</th>
                                    <th>الفئة</th>
                                    <th>الخيارات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.priceInSYP}</td>
                                        <td>{p.costPrice}</td>
                                        <td>{categories.find(c => c.id === p.productCategoryId)?.name}</td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>تعديل</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>حذف</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}

export default Products;
