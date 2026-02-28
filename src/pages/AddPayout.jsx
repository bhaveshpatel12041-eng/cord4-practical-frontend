import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPayout, resetPayoutState } from '../store/slices/payoutSlice';
import { getVendors } from '../store/slices/vendorSlice';
import toast from 'react-hot-toast';

const AddPayout = () => {
    const [formData, setFormData] = useState({
        vendor_id: '',
        amount: '',
        mode: 'UPI',
        note: ''
    });

    const { vendor_id, amount, mode, note } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.payout);
    const { vendors } = useSelector((state) => state.vendor);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && user.role !== 'OPS') {
            toast.error('Only OPS can create payouts');
            navigate('/payouts');
        }
    }, [user, navigate]);

    useEffect(() => {
        dispatch(getVendors());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success('Payout drafted successfully!');
            navigate('/payouts');
        }
        dispatch(resetPayoutState());
    }, [isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!vendor_id) {
            toast.error('Please select a vendor');
            return;
        }
        dispatch(createPayout({ vendor_id, amount: Number(amount), mode, note }));
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>Create Payout Request</h2>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Select Vendor <span style={{ color: 'red' }}>*</span></label>
                    <select
                        name="vendor_id"
                        value={vendor_id}
                        onChange={onChange}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
                        required
                    >
                        <option value="" disabled>Select a vendor</option>
                        {vendors.filter(v => v.is_active).map(v => (
                            <option key={v._id} value={v._id}>{v.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Amount (₹) <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="number"
                        name="amount"
                        value={amount}
                        step="0.01"
                        min="0.01"
                        onChange={onChange}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Payout Mode <span style={{ color: 'red' }}>*</span></label>
                    <select
                        name="mode"
                        value={mode}
                        onChange={onChange}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
                        required
                    >
                        <option value="UPI">UPI</option>
                        <option value="IMPS">IMPS</option>
                        <option value="NEFT">NEFT</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Notes (Optional)</label>
                    <textarea
                        name="note"
                        value={note}
                        onChange={onChange}
                        rows="3"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{ flex: 1, padding: '0.75rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                        {isLoading ? 'Creating...' : 'Create Draft'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/payouts')}
                        style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPayout;
