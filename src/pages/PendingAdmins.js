import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function PendingAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch pending admins
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/Auth/pending-admins');
                setAdmins(res.data || []);
            } catch (err) {
                console.error('Failed to load pending admins:', err);
                alert('فشل تحميل المسؤولين المعلقين');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Approve a single admin
    const handleApprove = async (id) => {
        if (!window.confirm('هل أنت متأكد من الموافقة على هذا المسؤول؟')) return;
        try {
            await api.post(`/Auth/approve/${id}`);
            setAdmins((prev) => prev.filter((a) => a.id !== id));
            alert('تمت الموافقة بنجاح');
        } catch (err) {
            console.error('Approval failed:', err);
            alert('فشل في الموافقة');
        }
    };

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div>
            <h4 className="mb-4">المسؤولون المعلقون</h4>
            {admins.length === 0 ? (
                <div className="alert alert-info">لا يوجد مسؤولون جدد في الانتظار.</div>
            ) : (
                <table className="table table-bordered text-center shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th>المعرف</th>
                            <th>اسم المستخدم</th>
                            <th>الرئيسي</th>
                            <th>خيارات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((a) => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.username}</td>
                                <td>{a.isMainAdmin ? 'نعم' : 'لا'}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleApprove(a.id)}
                                    >
                                        موافقة
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
