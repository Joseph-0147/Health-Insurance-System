import React from 'react';

const Support = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    🎧
                </div>
                <h2 className="text-xl font-bold text-gray-900">Need Help?</h2>
                <p className="text-gray-500 mt-2">Contact our support team at support@healthinsure.co.ke</p>
                <button className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-all font-medium">
                    Open Ticket
                </button>
            </div>
        </div>
    );
};

export default Support;
