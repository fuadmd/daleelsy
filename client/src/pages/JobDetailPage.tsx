import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, Briefcase, Clock, DollarSign, Heart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const jobId = parseInt(id || "0");
  const { data: job, isLoading } = trpc.jobs.getById.useQuery(jobId);
  const { data: bookmarks } = trpc.bookmarks.list.useQuery();
  const applyMutation = trpc.applications.submit.useMutation();
  const bookmarkMutation = trpc.bookmarks.add.useMutation();
  const removeBookmarkMutation = trpc.bookmarks.remove.useMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Job not found</h2>
          <Button onClick={() => navigate("/jobs")} className="mt-4">
            Back to Jobs
          </Button>
        </Card>
      </div>
    );
  }

  const isBookmarked = bookmarks?.some((b) => b.jobId === job.id);

  const handleApply = async () => {
    if (!user) {
      navigate("/");
      return;
    }

    try {
      await applyMutation.mutateAsync({
        jobId: job.id,
        coverLetter,
      });
      setShowApplyForm(false);
      setCoverLetter("");
      // Show success message
    } catch (error) {
      console.error("Failed to apply:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate("/jobs")} className="mb-4">
            ← Back to Jobs
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">{job.title}</h1>
              <p className="text-slate-600 mt-2">{job.location}</p>
            </div>
            <button
              onClick={() => {
                if (isBookmarked) {
                  removeBookmarkMutation.mutate(job.id);
                } else {
                  bookmarkMutation.mutate(job.id);
                }
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <Heart
                className={`w-8 h-8 ${
                  isBookmarked ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-500"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Job Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">Job Type</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">{job.jobType}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Posted</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </Card>
              {job.salary && (
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-slate-600 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Salary</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{job.salary}</p>
                </Card>
              )}
              <Card className="p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Location</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">{job.location}</p>
              </Card>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Role</h2>
              <div className="prose prose-sm max-w-none text-slate-700">
                <p>{job.description}</p>
              </div>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Requirements</h2>
                <div className="prose prose-sm max-w-none text-slate-700">
                  <p>{job.requirements}</p>
                </div>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Responsibilities</h2>
                <div className="prose prose-sm max-w-none text-slate-700">
                  <p>{job.responsibilities}</p>
                </div>
              </Card>
            )}

            {/* Skills */}
            {job.skills && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {(job.skills as any).split(",").map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-24 space-y-4">
              {!showApplyForm ? (
                <>
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowApplyForm(true)}
                  >
                    Apply Now
                  </Button>
                  <Button size="lg" variant="outline" className="w-full">
                    Save Job
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-slate-900">Apply for this job</h3>
                  <textarea
                    placeholder="Write a cover letter (optional)..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={6}
                  />
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleApply}
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowApplyForm(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              <div className="pt-4 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Job Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-600">Experience Level:</span>
                    <p className="font-medium text-slate-900">{job.experience || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Work Type:</span>
                    <p className="font-medium text-slate-900">{job.remote || "On-site"}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Applications:</span>
                    <p className="font-medium text-slate-900">{job.applicationCount || 0}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
