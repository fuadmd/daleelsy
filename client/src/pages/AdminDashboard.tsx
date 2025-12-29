import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Briefcase, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Platform management and oversight</p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">2,543</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Active Jobs</p>
                <p className="text-3xl font-bold text-slate-900">156</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Applications</p>
                <p className="text-3xl font-bold text-slate-900">4,821</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Flagged Content</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Management Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Management */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">User Management</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Manage Users</p>
                    <p className="text-sm text-slate-600">View, edit, and manage user accounts</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Go
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Verify Employers</p>
                    <p className="text-sm text-slate-600">Review and approve employer accounts</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Go
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Ban/Suspend Users</p>
                    <p className="text-sm text-slate-600">Manage user suspensions and bans</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Go
                  </Button>
                </div>
              </div>
            </Card>

            {/* Content Moderation */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Content Moderation</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Review Flagged Jobs</p>
                    <p className="text-sm text-slate-600">12 jobs pending review</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Review
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Review Flagged Applications</p>
                    <p className="text-sm text-slate-600">3 applications pending review</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Review
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Reported Content</p>
                    <p className="text-sm text-slate-600">View and manage reports</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Go
                  </Button>
                </div>
              </div>
            </Card>

            {/* Platform Management */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Platform Management</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">System Settings</p>
                    <p className="text-sm text-slate-600">Configure platform settings</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Go
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Analytics & Reports</p>
                    <p className="text-sm text-slate-600">View platform analytics</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Go
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Admin Logs</p>
                    <p className="text-sm text-slate-600">View admin activity logs</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Go
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="pb-3 border-b border-slate-200">
                  <p className="font-medium text-slate-900">New employer signup</p>
                  <p className="text-slate-600">2 minutes ago</p>
                </div>
                <div className="pb-3 border-b border-slate-200">
                  <p className="font-medium text-slate-900">Job flagged</p>
                  <p className="text-slate-600">15 minutes ago</p>
                </div>
                <div className="pb-3 border-b border-slate-200">
                  <p className="font-medium text-slate-900">User banned</p>
                  <p className="text-slate-600">1 hour ago</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Payment received</p>
                  <p className="text-slate-600">3 hours ago</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Send Announcement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  System Status
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
