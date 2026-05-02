import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ইউআরএল এর # হ্যাশ থেকে ডেটা নেওয়া
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));
    const token = params.get('access_token');

    if (token) {
      console.log("সফল! আপনার টোকেন:", token);
      
      // এখানে আপনি ইউজারের তথ্য নিয়ে ড্যাশবোর্ডে পাঠিয়ে দিতে পারেন
      // যেমন: localStorage.setItem('token', token);
      navigate('/'); // লগইন শেষে যেখানে পাঠাতে চান
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>লগইন প্রসেসিং হচ্ছে...</h2>
      <p>অনুগ্রহ করে অপেক্ষা করুন।</p>
    </div>
  );
};

export default AuthCallback;