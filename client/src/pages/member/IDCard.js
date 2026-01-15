import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const IDCard = () => {
  const { user } = useAuth();
  const cardRef = useRef(null);

  // State for member data
  const [memberInfo, setMemberInfo] = useState({
    name: 'Loading...',
    memberId: '...',
    groupNumber: '...',
    planName: 'Loading...',
    effectiveDate: '...',
    copay: { pcp: '-', specialist: '-', er: '-' },
    rxBin: '-',
    rxPcn: '-',
    rxGroup: '-',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch Member Profile
        const memberRes = await fetch('/api/members/me', { headers });
        const memberData = await memberRes.json();
        const member = memberData.success ? memberData.data : null;

        // 2. Fetch Active Policy
        const policyRes = await fetch('/api/policies/my-policies', { headers });
        const policyData = await policyRes.json();
        const policy = policyData.success && policyData.data?.length > 0 ? policyData.data[0] : null;

        // Build member info with fallbacks
        const memberName = member?.user
          ? `${member.user.firstName} ${member.user.lastName}`
          : user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : 'Member';

        setMemberInfo({
          name: memberName,
          memberId: member?.id ? `MEM-${new Date(member.createdAt).getFullYear()}-${member.id.substring(0, 6).toUpperCase()}` : 'MEM-PENDING',
          groupNumber: policy?.policyNumber || 'GRP-KEN-001',
          planName: policy
            ? (policy.type === 'family' ? 'Family Gold Plan' : 'Individual Premium Plan')
            : 'No Active Policy',
          effectiveDate: policy?.startDate
            ? new Date(policy.startDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'N/A',
          copay: { pcp: 'ksh 500', specialist: 'ksh 1,000', er: 'ksh 2,000' },
          rxBin: '254001',
          rxPcn: 'KEN-RX',
          rxGroup: 'NHIF-PRO'
        });
      } catch (error) {
        console.error("ID Card fetch error:", error);
        // Fallback to AuthContext user
        setMemberInfo(prev => ({
          ...prev,
          name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Member',
          planName: 'Unable to load policy'
        }));
      }
    };
    fetchData();
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital ID Card</h1>
          <p className="text-gray-500 mt-1">Your insurance card at your fingertips</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <span>🖨️</span> Print Card
          </button>
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <span>📱</span> Add to Wallet
          </button>
        </div>
      </div>

      {/* Front of Card */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">F</span>
          <h2 className="text-lg font-semibold text-gray-700">Front of Card</h2>
        </div>
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <span className="text-2xl font-bold">🛡️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Antigravity Health</h3>
                  <p className="text-white/70 text-sm">Platinum Member</p>
                </div>
              </div>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold border border-white/30 shadow-sm">
                {memberInfo.planName}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wide">Member Name</p>
                <p className="text-2xl font-bold font-serif">{memberInfo.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wide">Member ID</p>
                  <p className="font-mono font-bold text-lg">{memberInfo.memberId}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wide">Policy Number</p>
                  <p className="font-mono font-bold text-lg">{memberInfo.groupNumber}</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <p className="text-white/60 text-xs uppercase tracking-wide mb-2">Benefit Copayments (KES)</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-white/60 text-xs">PCP</p>
                    <p className="font-bold text-lg">{memberInfo.copay.pcp}</p>
                  </div>
                  <div className="text-center border-l border-r border-white/20">
                    <p className="text-white/60 text-xs">Specialist</p>
                    <p className="font-bold text-lg">{memberInfo.copay.specialist}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-xs">ER/Inpatient</p>
                    <p className="font-bold text-lg">{memberInfo.copay.er}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wide">Effective Date</p>
                  <p className="font-semibold">{memberInfo.effectiveDate}</p>
                </div>
                <div className="flex gap-1 items-center bg-black/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                  <span className="text-xs font-bold text-white/50 mr-2 uppercase">VERIFIED</span>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-1.5 h-6 bg-white/40 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back of Card */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">B</span>
          <h2 className="text-lg font-semibold text-gray-700">Back of Card</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-8 bg-gray-800"></div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">💊</span>
                  Pharmacy Benefits
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white border border-purple-100 rounded-lg p-2 shadow-sm">
                    <span className="text-gray-500 text-sm">BIN</span>
                    <span className="font-mono font-semibold">{memberInfo.rxBin}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white border border-purple-100 rounded-lg p-2 shadow-sm">
                    <span className="text-gray-500 text-sm">PCN</span>
                    <span className="font-mono font-semibold">{memberInfo.rxPcn}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white border border-purple-100 rounded-lg p-2 shadow-sm">
                    <span className="text-gray-500 text-sm">Group</span>
                    <span className="font-mono font-semibold">{memberInfo.rxGroup}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">📞</span>
                  Support Hotlines
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Member Services</p>
                    <p className="font-bold text-gray-900">+254 700 000 000</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">24/7 Nurse Line</p>
                    <p className="font-bold text-gray-900">+254 711 111 111</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Emergency (24h)</p>
                    <p className="font-bold text-red-600">0800 911 111</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Antigravity Health Solutions, Westlands Business Park, Nairobi, Kenya
              </p>
              <p className="text-sm text-purple-600 font-bold mt-1 hover:underline cursor-pointer">
                www.antigravityhealth.co.ke
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">💡</span>
            Using Your Digital ID Card
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <p className="text-sm text-gray-700">Show this card at your provider's office during check-in</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <p className="text-sm text-gray-700">Use the pharmacy information when filling prescriptions</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <p className="text-sm text-gray-700">Print or save to your phone's wallet for easy access</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <p className="text-sm text-gray-700">Contact Member Services for a physical card replacement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCard;
