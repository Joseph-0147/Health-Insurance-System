import React from 'react';

const Notifications = () => {
    const notifications = [
        { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance on Saturday at 2 AM.', type: 'info', time: '2 hours ago', read: false },
        { id: 2, title: 'Policy Update', message: 'New health guidelines have been published.', type: 'warning', time: '1 day ago', read: false },
        { id: 3, title: 'Welcome', message: 'Welcome to the new portal experience!', type: 'success', time: '3 days ago', read: true },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 mt-1">Stay updated with system alerts and messages</p>
                </div>
                <button className="text-sm text-purple-600 font-medium hover:text-purple-700">Mark all as read</button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {notifications.map((note) => (
                        <div key={note.id} className={`p-6 hover:bg-gray-50 transition-colors flex gap-4 ${!note.read ? 'bg-purple-50/30' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${note.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                    note.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                        'bg-green-100 text-green-600'
                                }`}>
                                {note.type === 'info' ? 'ℹ️' : note.type === 'warning' ? '⚠️' : '✅'}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-semibold text-gray-900 ${!note.read ? 'font-bold' : ''}`}>{note.title}</h3>
                                    <span className="text-xs text-gray-500">{note.time}</span>
                                </div>
                                <p className="text-gray-600 mt-1">{note.message}</p>
                            </div>
                            {!note.read && (
                                <div className="self-center">
                                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {notifications.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No notifications to display.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
