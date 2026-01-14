import React from 'react';

const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    ⚙️
                </div>
                <h2 className="text-xl font-bold text-gray-900">System Configuration</h2>
                <p className="text-gray-500 mt-2">System and account settings module coming soon.</p>
            </div>
        </div>
    );
};

export default Settings;
