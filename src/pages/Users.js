import React, { useEffect, useState } from 'react';
import api from '../api/api';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/User');
            setUsers(res.data || []);
        } catch {
            alert('فشل تحميل المستخدمين');
        }
    };

    const handleBlockToggle = async (id) => {
        try {
            await api.put(`/User/block/${id}`);
            fetchUsers();
        } catch {
            alert('فشل في تحديث حالة المستخدم');
        }
    };

    return (
        <div>
            <h4 className="mb-3">إدارة المستخدمين</h4>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>المعرف</th>
                        <th>اسم المستخدم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الحالة</th>
                        <th>الخيارات</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username || '—'}</td>
                            <td>{u.email || '—'}</td>
                            <td>{u.isBlocked ? 'محظور' : 'نشط'}</td>
                            <td>
                                <button
                                    className={`btn btn-sm ${u.isBlocked ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => handleBlockToggle(u.id)}
                                >
                                    {u.isBlocked ? 'إلغاء الحظر' : 'حظر'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;
