import React, { useEffect, useState } from 'react';
import api from '../api/api';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '' });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/VendorCategory/${editId}`, form);
            } else {
                await api.post('/VendorCategory', { name: form.name });

            }
            setForm({ name: '' });
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

            <form className="mb-3" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <input
                            className="form-control mb-2"
                            placeholder="اسم الفئة"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
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
                        <th>الخيارات</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
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
