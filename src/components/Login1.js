import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ You forgot to import axios
import api from '../api/api'; // optional, if you use your api wrapper

function Login() {


    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(REACT_APP_API_URL, {
                username: form.username,
                password: form.password,
            });

            const token = res.data?.token;
            if (token) {
                localStorage.setItem('token', token);
                navigate('/dashboard/vendors');
            } else {
                alert('Login successful but no token received');
            }
        } catch (err) {
            alert('فشل تسجيل الدخول');
            console.error(err);
        }
    };


    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-4 shadow rounded-4" style={{ maxWidth: 400, width: '100%' }}>
                <h4 className="text-center text-primary mb-4">تسجيل دخول المدير</h4>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">البريد الإلكتروني</label>
                        <input
                            className="form-control"
                            type="username"
                            placeholder="اسم المستخدم"
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
                            placeholder="********"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            dir="rtl"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">دخول</button>

                    <div className="text-center mt-3">
                        <span>ليس لديك حساب؟ </span>
                        <button
                            type="button"
                            className="btn btn-link text-primary p-0"
                            onClick={() => navigate('/register')}
                        >
                            تسجيل حساب
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
