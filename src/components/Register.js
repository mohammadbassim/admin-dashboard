import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function Register() {
    // Use password (not passwordHash) in form state for clarity
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send as PasswordHash to match backend expectation
            await api.post('/Auth/register', {
                username: form.username,
                PasswordHash: form.password
            });
            alert('تم التسجيل بنجاح');
            navigate('/login');
        } catch (err) {
            alert('فشل التسجيل');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-4 shadow rounded-4" style={{ maxWidth: 400, width: '100%' }}>
                <h4 className="text-center text-primary mb-4">تسجيل حساب مدير</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">اسم المستخدم</label>
                        <input
                            className="form-control"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                            dir="rtl"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">كلمة المرور</label>
                        <input
                            type="password"
                            className="form-control"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            dir="rtl"
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">تسجيل</button>

                    <div className="text-center mt-3">
                        <span>لديك حساب؟ </span>
                        <button
                            type="button"
                            className="btn btn-link text-primary p-0"
                            onClick={() => navigate('/login')}
                        >
                            دخول
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
