import React, { useEffect, useState } from 'react';
import api from '../api/api';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', imageUrl: '' });
    const [imageFile, setImageFile] = useState(null);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/VendorCategory');
            setCategories(res.data);
        } catch {
            alert('فشل تحميل الفئات');
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (!file) return;
        const formData = new FormData();
        formData.append('Image', file);
        try {
            const res = await api.post('/Upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm(f => ({ ...f, imageUrl: res.data.url || res.data.imageUrl }));
        } catch {
            alert('فشل رفع الصورة');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = form.imageUrl;
            if (imageFile && !form.imageUrl) {
                const formData = new FormData();
                formData.append('Image', imageFile);
                const res = await api.post('/Upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = res.data.url || res.data.imageUrl;
            }
            if (editId) {
                await api.put(`/VendorCategory/${editId}`, { name: form.name, imageUrl });
            } else {
                await api.post('/VendorCategory', { name: form.name, imageUrl });
            }
            setForm({ name: '', imageUrl: '' });
            setImageFile(null);
            setEditId(null);
            fetchCategories();
        } catch {
            alert('فشل الحفظ');
        }
    };

    const handleEdit = (c) => {
        setForm({ name: c.name });
        setEditId(c.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل تريد حذف الفئة؟')) {
            try {
                await api.delete(`/VendorCategory/${id}`);
                fetchCategories();
            } catch {
                alert('فشل في الحذف');
            }
        }
    };

    return (
        <div>
            <h4 className="mb-3">إدارة الفئات</h4>

            <form className="mb-3" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                    <div className="col-md-4">
                        <input
                            className="form-control mb-2"
                            placeholder="اسم الفئة"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control mb-2"
                            onChange={handleImageChange}
                        />
                        {form.imageUrl && (
                            <img src={form.imageUrl.startsWith('/uploads/') ? `${process.env.REACT_APP_API_URL || 'http://192.168.1.29:5010'}${form.imageUrl}` : form.imageUrl} alt="تصوير" style={{ maxWidth: 80, maxHeight: 80, marginTop: 8 }} />
                        )}
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-success">{editId ? 'تعديل' : 'إضافة'}</button>
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
                            <td>
                                {c.imageUrl && (
                                    <img src={c.imageUrl.startsWith('/uploads/') ? `${process.env.REACT_APP_API_URL || 'http://192.168.1.29:5010'}${c.imageUrl}` : c.imageUrl} alt="تصوير" style={{ maxWidth: 60, maxHeight: 60 }} />
                                )}
                            </td>
                            <td>
                                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(c)}>تعديل</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>حذف</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Categories;
