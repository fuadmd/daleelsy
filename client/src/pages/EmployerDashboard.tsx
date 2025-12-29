import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Plus, BarChart3, Users, TrendingUp } from "lucide-react";

export default function EmployerDashboard() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Employer Dashboard</h1>
            <p className="text-slate-600 mt-2">Manage your job postings and applications</p>
          </div>
          <Button
            onClick={() => navigate("/employer/post-job")}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post a Job
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Active Jobs</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Applications</p>
                <p className="text-3xl font-bold text-slate-900">245</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Shortlisted</p>
                <p className="text-3xl font-bold text-slate-900">38</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Plan</p>
                <p className="text-xl font-bold text-slate-900">Premium</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-yellow-600">★</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Jobs */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Active Job Postings</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">Senior Software Engineer</h3>
                        <p className="text-sm text-slate-600 mt-1">Posted 2 days ago</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">45 applications</p>
                        <p className="text-xs text-slate-600">8 shortlisted</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        View Applications
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        Close
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Subscription Info */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-bold text-slate-900 mb-3">Premium Plan</h3>
              <ul className="space-y-2 text-sm text-slate-700 mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Unlimited job postings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Featured listings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Advanced analytics
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                Manage Subscription
              </Button>
            </Card>

            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Company Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Billing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
