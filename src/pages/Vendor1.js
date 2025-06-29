import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Vendors() {


    const [vendors, setVendors] = useState([]);

    const [form, setForm] = useState({
        name: '',
        phoneNumber: '',
        password: '',
        location: '',
        dollarExchangeRate: '',
        vendorCategoryId: '',
        imageFile: null
    });
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchVendors();
        fetchCategories();


    }, []);


    const handleDeleteVendor = async (vendorId) => {
        const confirmDelete = window.confirm('هل أنت متأكد من حذف هذا المتجر؟');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await api.delete(`/Vendor/${vendorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('تم حذف المتجر بنجاح');
            setVendors((prev) => prev.filter((v) => v.id !== vendorId));
        } catch (err) {
            console.error(err);
            alert('فشل حذف المتجر');
        }
    };



    const fetchVendors = async () => {
        try {
            const res = await api.get('/Vendor');
            setVendors(res.data);
        } catch (err) {
            console.error('Failed to fetch vendors:', err);
            alert('فشل تحميل البائعين');
        }
    };


    const fetchCategories = async () => {
        try {
            const res = await api.get('/VendorCategory');
            setCategories(res.data);
        } catch {
            alert('فشل في تحميل الفئات');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('phoneNumber', form.phoneNumber);
        formData.append('password', form.password);
        formData.append('location', form.location);
        formData.append('dollarExchangeRate', form.dollarExchangeRate);
        formData.append('vendorCategoryId', form.vendorCategoryId);
        if (form.imageFile) formData.append('image', form.imageFile);
        try {
            if (selectedId) {
                await api.put(`/Vendor/${selectedId}/with-image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/Vendor/with-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setForm({ name: '', phoneNumber: '', password: '', location: '', dollarExchangeRate: '', vendorCategoryId: '', imageFile: null });
            setSelectedId(null);
            fetchVendors();
        } catch (error) {
            alert('فشل حفظ البائع');
            console.error(error);
        }
    };


    const handleEdit = (v) => {
        setForm({
            name: v.name,
            location: v.location,
            dollarExchangeRate: v.dollarExchangeRate,
            vendorCategoryId: v.vendorCategoryId,
        });
        setSelectedId(v.id);
    };

    // Helper to get full image URL
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return 'http://45.149.207.65:5000' + url;
    };


    return (
        <div>
            <h4 className="mb-3">إدارة البائعين</h4>

            <form className="mb-4" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <label>اسم البائع</label>
                        <input
                            className="form-control mb-2"
                            placeholder="مثال: محل الشام"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label>رقم الجوال</label>
                        <input
                            className="form-control mb-2"
                            placeholder="مثال: 09xxxxxxxxx"
                            value={form.phoneNumber}
                            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label>كلمة المرور</label>
                        <input
                            type="password"
                            className="form-control mb-2"
                            placeholder="كلمة مرور البائع"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label>الموقع</label>
                        <input
                            className="form-control mb-2"
                            placeholder="مثال: دمشق"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label>سعر صرف الدولار</label>
                        <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="مثال: 15500"
                            value={form.dollarExchangeRate}
                            onChange={(e) => setForm({ ...form, dollarExchangeRate: e.target.value })}
                            required
                        />
                    </div>

                    <div className="col-md-8">
                        <label>صورة البائع</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control mb-2"
                            onChange={e => setForm({ ...form, imageFile: e.target.files[0] })}
                        />
                    </div>

                    <div className="col-md-6">
                        <label>فئة البائع</label>
                        <select
                            className="form-control mb-2"
                            value={form.vendorCategoryId}
                            onChange={(e) =>
                                setForm({ ...form, vendorCategoryId: parseInt(e.target.value) })
                            }
                            required
                        >
                            <option value="">-- اختر الفئة --</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>


                    </div>

                    <div className="col-md-6 text-end">
                        <button type="submit" className="btn btn-success mt-4">
                            {selectedId ? 'تعديل البائع' : 'إضافة بائع'}
                        </button>
                    </div>
                </div>
            </form>


            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>اسم البائع</th>
                        <th>الموقع</th>
                        <th>الفئة</th>
                        <th>صورة البائع</th>
                        <th>إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {vendors.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">
                                <div className="alert alert-warning mb-0">لا يوجد بائعين لعرضهم.</div>
                            </td>
                        </tr>
                    ) : (
                        vendors.map((v) => (
                            <tr key={v.id}>
                                <td>{v.name}</td>
                                <td>{v.location}</td>
                                <td>{v.vendorCategory?.name || 'غير محددة'}</td>
                                <td>{v.imageUrl && <img src={getImageUrl(v.imageUrl)} alt={v.name} style={{ width: 50 }} />}</td>
                                <td>
                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() => navigate(`/dashboard/vendors/${v.id}`)}
                                    >
                                        عرض التفاصيل
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleDeleteVendor(v.id)}
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

export default Vendors;
