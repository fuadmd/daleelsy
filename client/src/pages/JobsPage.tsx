import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Search, MapPin, Briefcase, Clock, Heart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [profession, setProfession] = useState("");
  const [region, setRegion] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: jobs, isLoading } = trpc.jobs.list.useQuery({
    search,
    profession,
    region,
    sortBy,
  });

  const { data: bookmarks } = trpc.bookmarks.list.useQuery();
  const bookmarkMutation = trpc.bookmarks.add.useMutation();
  const removeBookmarkMutation = trpc.bookmarks.remove.useMutation();

  const isBookmarked = (jobId: number) => {
    return bookmarks?.some((b) => b.jobId === jobId);
  };

  const handleBookmark = (jobId: number) => {
    if (isBookmarked(jobId)) {
      removeBookmarkMutation.mutate(jobId);
    } else {
      bookmarkMutation.mutate(jobId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-slate-600">Browse thousands of job openings across Syria</p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Filters</h2>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Job title..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Profession</label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Professions</option>
                    <option value="software-engineering">Software Engineering</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Regions</option>
                    <option value="damascus">Damascus</option>
                    <option value="aleppo">Aleppo</option>
                    <option value="homs">Homs</option>
                    <option value="hama">Hama</option>
                    <option value="latakia">Latakia</option>
                    <option value="tartus">Tartus</option>
                    <option value="idlib">Idlib</option>
                    <option value="raqqa">Raqqa</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearch("");
                    setProfession("");
                    setRegion("");
                    setSortBy("newest");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </Card>
                ))}
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition">
                          {job.title}
                        </h3>
                        <p className="text-slate-600 mt-1">{job.description?.substring(0, 150)}...</p>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.jobType}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                          {job.salary && <div className="font-medium text-slate-900">{job.salary}</div>}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(job.id);
                        }}
                        className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            isBookmarked(job.id)
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400 hover:text-red-500"
                          }`}
                        />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-600">Try adjusting your filters or search terms</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
