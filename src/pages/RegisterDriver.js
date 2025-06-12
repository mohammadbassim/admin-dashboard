import React, { useState } from 'react';
import api from '../api/api';

function RegisterDriver() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
        try {
            await api.post('/vendor/drivers', { name, phone, password });
            setSuccess('تم تسجيل السائق بنجاح');
            setName('');
            setPhone('');
            setPassword('');
        } catch (err) {
            setError('فشل تسجيل السائق. ربما رقم الهاتف مستخدم بالفعل.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <h4 className="mb-3">تسجيل سائق جديد</h4>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">اسم السائق</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">رقم الهاتف</label>
                    <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">كلمة المرور</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'جاري التسجيل...' : 'تسجيل'}
                </button>
            </form>
            {success && <div className="alert alert-success mt-3">{success}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
}

export default RegisterDriver;
