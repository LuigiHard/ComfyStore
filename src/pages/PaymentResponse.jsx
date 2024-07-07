import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentResponse = () => {
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get('status');

    if (status === 'approved') {
      toast.success('Payment successful!');
    } else {
      toast.error('Payment failed. Please try again.');
    }
  }, [location]);

  return (
    <div>
      <h1>Payment Response</h1>
      <p>Check the console for payment status.</p>
    </div>
  );
};

export default PaymentResponse;