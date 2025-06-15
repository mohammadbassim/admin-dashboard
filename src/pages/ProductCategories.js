import React, { useEffect, useState } from 'react';
import api from '../api/api';

function ProductCategories() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', imageFile: null });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);    const fetchCategories = async () => {
        try {
            const res = await api.get('/ProductCategory');
            setCategories(res.data);
        } catch {
            alert('فشل تحميل الفئات');
        }
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        if (form.imageFile) formData.append('image', form.imageFile);
        try {
            if (editId) {
                await api.put(`/ProductCategory/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/ProductCategory', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setForm({ name: '', imageFile: null });
            setEditId(null);
            fetchCategories();
            // Reset file input
            if (document.getElementById('category-image-input')) {
                document.getElementById('category-image-input').value = '';
            }
        } catch {
            alert('فشل الحفظ');
        }
    };

    const handleEdit = (c) => {
        setForm({ name: c.name, imageFile: null });
        setEditId(c.id);
    };    const handleDelete = async (id) => {
        if (window.confirm('هل تريد حذف الفئة؟')) {
            try {
                await api.delete(`/ProductCategory/${id}`);
                fetchCategories();
            } catch {
                alert('فشل في الحذف');
            }
        }
    };

    // Helper to get full image URL
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        // Use your API base URL for all relative paths
        return 'http://45.149.207.65:5000' + url;
    };

    return (
        <div>
            <h4 className="mb-3">إدارة فئات المنتجات</h4>
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
                    <div className="col-md-4">                        <input
                            type="file"
                            accept="image/*"
                            id="category-image-input"
                            className="form-control mb-2"
                            onChange={e => setForm({ ...form, imageFile: e.target.files[0] })}
                            required={!editId}
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
                        <th>الصورة</th>
                        <th>الخيارات</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.imageUrl && <img src={getImageUrl(c.imageUrl)} alt={c.name} style={{ maxWidth: 60, maxHeight: 60, borderRadius: 4 }} />}</td>
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

export default ProductCategories;
