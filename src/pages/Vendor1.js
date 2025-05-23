import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Vendors() {


    const [vendors, setVendors] = useState([]);

    const [form, setForm] = useState({
        name: '',
        location: '',
        dollarExchangeRate: '',
        imageUrl: '',
        vendorCategoryId: ''
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

        try {


            const data = {
                name: form.name,
                location: form.location,
                dollarExchangeRate: parseFloat(form.dollarExchangeRate),
                imageUrl: form.imageUrl,
                vendorCategoryId: parseInt(form.vendorCategoryId)


            };
            if (!data.vendorCategoryId || isNaN(data.vendorCategoryId)) {
                alert('يرجى اختيار فئة البائع');
                return;
            }
            console.log('Form state:', form);
            console.log('Categories:', categories);



            if (selectedId) {
                await api.put(`/Vendor/${selectedId}`, data);
            } else {
                await api.post('/Vendor', data);
            }

            setForm({ name: '', location: '', dollarExchangeRate: '', imageUrl: '', vendorCategoryId: '' });
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
                        <label>رابط الصورة</label>
                        <input
                            className="form-control mb-2"
                            placeholder="رابط مباشر لصورة البائع"
                            value={form.imageUrl}
                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        />
                    </div>

                    <div className="col-md-4 text-center">
                        {form.imageUrl && (
                            <img
                                src={form.imageUrl}
                                alt="Vendor Preview"
                                style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: '0.5rem' }}
                            />
                        )}
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

                <tbody>
                    <div>
                        <h4 className="mb-3">قائمة البائعين</h4>
                        {vendors.length === 0 ? (
                            <div className="alert alert-warning">لا يوجد بائعين لعرضهم.</div>
                        ) : (
                            <div className="row">
                                {vendors.map((v) => (
                                    <div key={v.id} className="col-md-4">
                                        <div className="card mb-3 shadow-sm">
                                            <div className="card-body">
                                                <h5 className="card-title">{v.name}</h5>
                                                <p className="card-text">الموقع: {v.location}</p>
                                                <p className="card-text">
                                                    الفئة: {v.vendorCategory?.name || 'غير محددة'}
                                                </p>
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => navigate(`/dashboard/vendors/${v.id}`)}
                                                >
                                                    عرض التفاصيل
                                                </button>

                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => handleDeleteVendor(v.id)}
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </tbody>
            </table>
        </div>
    );
}

export default Vendors;
