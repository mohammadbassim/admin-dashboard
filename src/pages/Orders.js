import React, { useEffect, useState } from 'react';
import api from '../api/api';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [trackingInfo, setTrackingInfo] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/Order/active');
            setOrders(res.data || []);
        } catch {
            alert('فشل تحميل الطلبات');
        }
    };

    const trackOrder = async (id) => {
        try {
            const res = await api.get(`/Order/track/${id}`);
            setTrackingInfo({ id, ...res.data });
        } catch {
            alert('فشل تتبع الطلب');
        }
    };

    return (
        <div>
            <h4 className="mb-3">الطلبات النشطة</h4>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>رقم الطلب</th>
                        <th>اسم العميل</th>
                        <th>التاريخ</th>
                        <th>الخيارات</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customerName || '—'}</td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-sm btn-info" onClick={() => trackOrder(order.id)}>
                                    تتبع
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {trackingInfo && (
                <div className="alert alert-secondary mt-4">
                    <h5>معلومات التتبع للطلب #{trackingInfo.id}</h5>
                    <pre>{JSON.stringify(trackingInfo, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Orders;
