import React, { useEffect, useState } from 'react';
import api from '../api/api';

function ActiveOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveOrders();
    }, []);

    const fetchActiveOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/vendor/orders/admin-view');
            setOrders(res.data || []);
        } catch {
            alert('فشل تحميل الطلبات النشطة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4 className="mb-3">الطلبات النشطة</h4>
            {loading ? <div>جاري التحميل...</div> : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>الحالة</th>
                            <th>اسم العميل</th>
                            <th>البائع</th>
                            <th>السائق</th>
                            <th>رقم السائق</th>
                            <th>تاريخ الإنشاء</th>
                            <th>طريقة الدفع</th>
                            <th>تفاصيل المنتجات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.status}</td>
                                <td>{order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}` : '—'}</td>
                                <td>{order.vendor ? order.vendor.name : '—'}</td>
                                <td>{order.driver ? order.driver.name : '—'}</td>
                                <td>{order.driver ? order.driver.phone : '—'}</td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    {order.orderDetails && order.orderDetails.length > 0 ? (
                                        <ul style={{ paddingLeft: 18 }}>
                                            {order.orderDetails.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.productName || '-'} - الكمية: {item.quantity ?? '-'} - السعر: {item.price ?? '-'}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ActiveOrders;
