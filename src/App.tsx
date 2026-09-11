/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Membership } from './components/Membership';
import { Donate } from './components/Donate';
import { Admin } from './components/Admin';
import { Cabinet } from './components/Cabinet';
import { News } from './components/News';
import { Events } from './components/Events';
import { Live } from './components/Live';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="membership" element={<Membership />} />
          <Route path="donate" element={<Donate />} />
          <Route path="cabinet" element={<Cabinet />} />
          <Route path="news" element={<News />} />
          <Route path="events" element={<Events />} />
          <Route path="live" element={<Live />} />
          <Route path="*" element={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Under Construction</h1>
              <p className="text-lg text-gray-600">This page is coming soon.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
