import React from 'react';

export function News() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Community News</h1>
      <p className="text-lg text-gray-600">
        Latest updates from Zwanan Jawkhela will appear here. This section is under development.
      </p>
    </div>
  );
}

export function Events() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
      <p className="text-lg text-gray-600">
        Calendar of community events, meetings, and campaigns will appear here. This section is under development.
      </p>
    </div>
  );
}
