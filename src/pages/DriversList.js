import React, { useEffect, useState } from 'react';
import api from '../api/api';

function DriversList() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/vendor/drivers');
            setDrivers(res.data || []);
        } catch {
            alert('فشل تحميل قائمة السائقين');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4 className="mb-3">قائمة السائقين المسجلين</h4>
            {loading ? <div>جاري التحميل...</div> : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>رقم الهاتف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.id}>
                                <td>{driver.name}</td>
                                <td>{driver.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DriversList;
