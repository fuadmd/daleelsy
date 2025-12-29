import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Eye } from "lucide-react";

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  field: string;
  graduationDate: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export default function CVBuilderPage() {
  const [cvTitle, setCvTitle] = useState("My CV");
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        id: Date.now().toString(),
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeWorkExperience = (id: string) => {
    setWorkExperience(workExperience.filter((exp) => exp.id !== id));
  };

  const updateWorkExperience = (id: string, field: string, value: string) => {
    setWorkExperience(
      workExperience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        id: Date.now().toString(),
        degree: "",
        institution: "",
        field: "",
        graduationDate: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setEducation(
      education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const addLanguage = () => {
    setLanguages([
      ...languages,
      {
        id: Date.now().toString(),
        name: "",
        proficiency: "intermediate",
      },
    ]);
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setLanguages(
      languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">CV Builder</h1>
            <p className="text-slate-600 mt-2">Create an ATS-compliant CV</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Save CV</Button>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {showPreview ? (
          // Preview Mode
          <Card className="p-12 bg-white max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-300 pb-6">
                <h1 className="text-3xl font-bold text-slate-900">{cvTitle}</h1>
              </div>

              {/* Work Experience */}
              {workExperience.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Work Experience</h2>
                  <div className="space-y-4">
                    {workExperience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{exp.jobTitle}</h3>
                            <p className="text-slate-600">{exp.company}</p>
                          </div>
                          <p className="text-slate-600 text-sm">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                        </div>
                        <p className="text-slate-700 mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Education</h2>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{edu.degree}</h3>
                            <p className="text-slate-600">
                              {edu.field} - {edu.institution}
                            </p>
                          </div>
                          <p className="text-slate-600 text-sm">{edu.graduationDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Languages</h2>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex justify-between">
                        <span className="text-slate-700">{lang.name}</span>
                        <span className="text-slate-600 capitalize">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          // Edit Mode
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* CV Title */}
              <Card className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">CV Title</h2>
                <Input
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  placeholder="e.g., My Professional CV"
                />
              </Card>

              {/* Work Experience */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Work Experience</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addWorkExperience}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>

                <div className="space-y-4">
                  {workExperience.map((exp) => (
                    <div key={exp.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder="Job Title"
                            value={exp.jobTitle}
                            onChange={(e) => updateWorkExperience(exp.id, "jobTitle", e.target.value)}
                          />
                          <Input
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="date"
                              value={exp.startDate}
                              onChange={(e) =>
                                updateWorkExperience(exp.id, "startDate", e.target.value)
                              }
                            />
                            <Input
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => updateWorkExperience(exp.id, "endDate", e.target.value)}
                            />
                          </div>
                          <textarea
                            placeholder="Job description..."
                            value={exp.description}
                            onChange={(e) =>
                              updateWorkExperience(exp.id, "description", e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                        <button
                          onClick={() => removeWorkExperience(exp.id)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Education */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Education</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addEducation}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>

                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <Input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          />
                          <Input
                            placeholder="Field of Study"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                          />
                          <Input
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          />
                          <Input
                            type="date"
                            value={edu.graduationDate}
                            onChange={(e) =>
                              updateEducation(edu.id, "graduationDate", e.target.value)
                            }
                          />
                        </div>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Languages */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Languages</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addLanguage}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>

                <div className="space-y-4">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex gap-3">
                      <Input
                        placeholder="Language"
                        value={lang.name}
                        onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                        className="flex-1"
                      />
                      <select
                        value={lang.proficiency}
                        onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="fluent">Fluent</option>
                      </select>
                      <button
                        onClick={() => removeLanguage(lang.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar - Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 space-y-4">
                <h3 className="font-bold text-slate-900">Quick Actions</h3>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Save CV</Button>
                <Button variant="outline" className="w-full">
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full">
                  Share CV
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
