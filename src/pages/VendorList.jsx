import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getVendors, resetVendorState } from '../store/slices/vendorSlice';
import toast from 'react-hot-toast';

const VendorList = () => {
    const dispatch = useDispatch();
    const { vendors, isLoading, isError, message } = useSelector((state) => state.vendor);

    useEffect(() => {
        if (isError) toast.error(message);
        dispatch(getVendors());
        return () => { dispatch(resetVendorState()); };
    }, [isError, message, dispatch]);

    if (isLoading) return (
        <div className="loading-state">
            <div className="spinner" />
            Loading vendors…
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Vendors</h1>
                    <p className="page-subtitle">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''} registered</p>
                </div>
                <Link to="/vendors/new" className="btn btn-primary">
                    + Add Vendor
                </Link>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>UPI ID</th>
                            <th>Bank Account</th>
                            <th>IFSC</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(v => (
                            <tr key={v._id}>
                                <td className="td-primary">{v.name}</td>
                                <td>{v.upi_id || <span style={{ color: 'var(--t3)' }}>—</span>}</td>
                                <td>{v.bank_account || <span style={{ color: 'var(--t3)' }}>—</span>}</td>
                                <td>{v.ifsc || <span style={{ color: 'var(--t3)' }}>—</span>}</td>
                                <td>
                                    <span className={`badge ${v.is_active ? 'badge-active' : 'badge-inactive'}`}>
                                        {v.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {vendors.length === 0 && (
                            <tr className="empty-row">
                                <td colSpan="5">No vendors found. Add one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorList;
