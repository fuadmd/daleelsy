import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function MyApplicationsPage() {
  const [, navigate] = useLocation();
  const { data: applications, isLoading } = trpc.applications.list.useQuery({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700";
      case "reviewing":
        return "bg-yellow-100 text-yellow-700";
      case "shortlisted":
        return "bg-green-100 text-green-700";
      case "accepted":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5" />;
      case "rejected":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Applications</h1>
          <p className="text-slate-600">Track the status of your job applications</p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        Job Application #{app.jobId}
                      </h3>
                    </div>
                    <p className="text-slate-600 mb-3">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>

                    {app.coverLetter && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-md">
                        <p className="text-sm text-slate-600">
                          <strong>Cover Letter:</strong> {app.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="capitalize">{app.status}</span>
                    </div>

                    {app.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2">
                        <strong>Reason:</strong> {app.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/jobs/${app.jobId}`)}>
                    View Job
                  </Button>
                  {app.status === "applied" && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Withdraw
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications yet</h3>
            <p className="text-slate-600 mb-6">Start applying to jobs to track your applications here</p>
            <Button onClick={() => navigate("/jobs")} className="bg-blue-600 hover:bg-blue-700">
              Browse Jobs
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
