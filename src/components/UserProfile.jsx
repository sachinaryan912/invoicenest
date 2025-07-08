import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthProvider';

const UserProfile = () => {
  const { user } = useAuth(); // from your AuthProvider
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };
    fetchUserData();
  }, [user]);

    return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>

        {userData ? (
          <ul className="space-y-2 text-gray-700">
            <li><strong>Email:</strong> {userData.email}</li>
            <li><strong>Plan:</strong> {userData.plan}</li>
            <li><strong>UID:</strong> {userData.uid}</li>
            <li><strong>Joined:</strong> {userData.createdAt?.toDate().toLocaleDateString()}</li>
          </ul>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};
export default UserProfile;