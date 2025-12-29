import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Briefcase, Users, TrendingUp, Shield, FileText, Zap } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "employer") {
        navigate("/employer/dashboard");
      } else if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/jobs");
      }
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              DaleelSY
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/jobs")}>
                  Browse Jobs
                </Button>
                <Button variant="ghost" onClick={() => navigate("/profile")}>
                  Profile
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => (window.location.href = getLoginUrl())}>
                  Sign In
                </Button>
                <Button onClick={() => (window.location.href = getLoginUrl())}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Find Your Perfect Job in Syria
              </h1>
              <p className="text-xl text-slate-600">
                Connect with top employers and build your career with DaleelSY. The most trusted job board for Syrian professionals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>

            <div className="flex gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>1000+ Active Jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>50K+ Professionals</span>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-4">
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="pt-4 space-y-2">
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-blue-100 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose DaleelSY?</h2>
            <p className="text-xl text-slate-600">Everything you need to succeed in your career</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "ATS-Compliant CV Builder",
                description: "Create professional CVs that pass through Applicant Tracking Systems with our intelligent builder.",
              },
              {
                icon: Shield,
                title: "Verified Employers",
                description: "Apply with confidence knowing all employers on our platform are verified and legitimate.",
              },
              {
                icon: Zap,
                title: "Smart Matching",
                description: "Get matched with jobs that align with your skills, experience, and career goals.",
              },
              {
                icon: TrendingUp,
                title: "Career Growth",
                description: "Access resources and insights to help you advance your career and reach new heights.",
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with other professionals, share experiences, and grow your network.",
              },
              {
                icon: Briefcase,
                title: "Local Opportunities",
                description: "Discover job opportunities across all regions of Syria with local expertise.",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">For Employers</h2>
              <p className="text-lg text-slate-600">
                Find top talent and build your dream team with DaleelSY's powerful recruitment tools.
              </p>
              <ul className="space-y-4">
                {[
                  "Post unlimited jobs (Premium)",
                  "Access to 50K+ qualified candidates",
                  "Advanced applicant tracking",
                  "Featured job listings",
                  "Employer analytics and insights",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Post a Job
              </Button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="space-y-3 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-12 w-12 bg-blue-100 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container max-w-7xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals and employers who are already using DaleelSY to achieve their goals.
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted}>
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free Today"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-white">DaleelSY</span>
              </div>
              <p className="text-sm">The leading job board for Syrian professionals.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    CV Builder
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Career Tips
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Solutions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2024 DaleelSY. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-white transition">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
