import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getVendors, resetVendorState } from '../store/slices/vendorSlice';
import toast from 'react-hot-toast';

const VendorList = () => {
    const dispatch = useDispatch();
    const { vendors, isLoading, isError, message } = useSelector((state) => state.vendor);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        dispatch(getVendors());

        return () => {
            dispatch(resetVendorState());
        };
    }, [isError, message, dispatch]);

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading vendors...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Vendors</h2>
                <Link
                    to="/vendors/new"
                    style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', textDecoration: 'none', borderRadius: '4px', fontWeight: '500' }}>
                    Add Vendor
                </Link>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Name</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>UPI ID</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Bank Account</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>IFSC</th>
                            <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#4b5563' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem 1rem', color: '#111827' }}>{vendor.name}</td>
                                <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{vendor.upi_id || '-'}</td>
                                <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{vendor.bank_account || '-'}</td>
                                <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{vendor.ifsc || '-'}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        backgroundColor: vendor.is_active ? '#d1fae5' : '#fee2e2',
                                        color: vendor.is_active ? '#065f46' : '#991b1b'
                                    }}>
                                        {vendor.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {vendors.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>No vendors found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorList;
