import React, { useEffect, useState } from 'react';
import api from '../api/api';

function OrderStats() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalOrders: 0, totalAmount: 0 });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/vendor/orders/admin-view');
            const orders = res.data || [];
            setOrders(orders);
            const totalOrders = orders.length;
            // Try to sum up all order totals (sum of all orderDetails price * quantity)
            let totalAmount = 0;
            orders.forEach(order => {
                if (order.orderDetails && order.orderDetails.length > 0) {
                    totalAmount += order.orderDetails.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
                }
            });
            setStats({ totalOrders, totalAmount });
        } catch {
            setStats({ totalOrders: 0, totalAmount: 0 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4 className="mb-4">إحصائيات الطلبات</h4>
            {loading ? <div>جاري التحميل...</div> : (
                <div className="alert alert-info" style={{ maxWidth: 400 }}>
                    <div><b>عدد الطلبات الكلي:</b> {stats.totalOrders}</div>
                    <div><b>إجمالي المبلغ:</b> {stats.totalAmount.toLocaleString()} ل.س</div>
                </div>
            )}
        </div>
    );
}

export default OrderStats;
