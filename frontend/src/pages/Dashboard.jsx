import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from '../components/PageHeader';
import Sidebar from '../components/Sidebar';
import QuickStats from '../components/dashboard/QuickStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import Recommendations from '../components/dashboard/Recommendations';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <PageHeader />
      <div className="flex flex-1">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome, User!</h1>
          <QuickStats />
          <RecentActivity />
          <Recommendations />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
