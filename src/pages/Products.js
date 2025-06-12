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

    useEffect(() => {
        fetchVendors();
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

    return (
        <div>
            <h4 className="mb-3">إدارة المنتجات</h4>

            <select className="form-control mb-3" onChange={handleVendorChange} value={selectedVendor || ''}>
                <option value="">اختر بائعًا</option>
                {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                ))}
            </select>

            {selectedVendor && (
                <>
                    <form className="mb-4" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <input className="form-control mb-2" placeholder="اسم المنتج"
                                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <input className="form-control mb-2" type="number" step="0.01" placeholder="تكلفة الشراء"
                                    value={form.price1} onChange={(e) => setForm({ ...form, price1: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <input className="form-control mb-2" type="number" step="0.01" placeholder="السعر بالليرة"
                                    value={form.priceInSYP} onChange={(e) => setForm({ ...form, priceInSYP: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control mb-2"
                                    onChange={e => setForm({ ...form, imageFile: e.target.files[0] })}
                                    required={!editId} // require image only when adding
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary">{editId ? 'تعديل' : 'إضافة'}</button>
                    </form>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>السم</th>
                                <th>السعر (ل.س)</th>
                                <th>الصورة</th>
                                <th>الخيارات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.priceInSYP}</td>
                                    <td><img src={p.imageUrl ? `http://192.168.1.29:5010${p.imageUrl}` : ''} alt={p.name} style={{ width: 50 }} /></td>
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
    );
}

export default Products;
