import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Onboarding() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"donor" | "nonprofit" | null>(null);
  const [loading, setLoading] = useState(false);

  const completeProfileMutation = trpc.user.completeProfile.useMutation();

  // Donor form state
  const [donorData, setDonorData] = useState({
    companyName: "",
    companyWebsite: "",
    industry: "",
    description: "",
    resourceTypes: [] as string[],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Nonprofit form state
  const [nonprofitData, setNonprofitData] = useState({
    organizationName: "",
    organizationWebsite: "",
    sector: "",
    mission: "",
    description: "",
    yearFounded: new Date().getFullYear(),
    teamSize: 0,
    technicalProficiency: "beginner" as const,
    primaryNeeds: [] as string[],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const resourceTypeOptions = [
    "ai_agents",
    "software_tools",
    "datasets",
    "computing_resources",
    "consulting",
    "training",
  ];

  const sectorOptions = [
    "Education",
    "Healthcare",
    "Environment",
    "Poverty Alleviation",
    "Housing",
    "Food Security",
    "Mental Health",
    "Other",
  ];

  const needsOptions = [
    "grant_writing",
    "data_analysis",
    "volunteer_management",
    "marketing",
    "financial_planning",
    "ai_automation",
  ];

  const handleRoleSelect = (selectedRole: "donor" | "nonprofit") => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleDonorResourceToggle = (resource: string) => {
    setDonorData(prev => ({
      ...prev,
      resourceTypes: prev.resourceTypes.includes(resource)
        ? prev.resourceTypes.filter(r => r !== resource)
        : [...prev.resourceTypes, resource],
    }));
  };

  const handleNonprofitNeedToggle = (need: string) => {
    setNonprofitData(prev => ({
      ...prev,
      primaryNeeds: prev.primaryNeeds.includes(need)
        ? prev.primaryNeeds.filter(n => n !== need)
        : [...prev.primaryNeeds, need],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const profileData = role === "donor" ? donorData : nonprofitData;
      await completeProfileMutation.mutateAsync({
        role: role!,
        profileData,
      });

      toast.success("Profile completed successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("Failed to complete profile. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Role Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Welcome to Tech-Equity Bridge</h1>
            <p className="text-lg text-muted-foreground">
              Choose your role to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Donor Card */}
            <Card
              className="card-elegant cursor-pointer hover:shadow-lg transition-all hover:border-primary"
              onClick={() => handleRoleSelect("donor")}
            >
              <CardHeader>
                <CardTitle className="text-2xl">Tech Donor</CardTitle>
                <CardDescription>
                  Share your AI agents, tools, and resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>List resources and AI agents</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Track impact and reach</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Build your CSR narrative</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Connect with non-profits</span>
                  </li>
                </ul>
                <Button className="w-full btn-elegant-primary gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Non-Profit Card */}
            <Card
              className="card-elegant cursor-pointer hover:shadow-lg transition-all hover:border-secondary"
              onClick={() => handleRoleSelect("nonprofit")}
            >
              <CardHeader>
                <CardTitle className="text-2xl">Non-Profit</CardTitle>
                <CardDescription>
                  Access digital resources and AI tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Browse resource marketplace</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Request resources instantly</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span>AI grant writing assistant</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Track impact and outcomes</span>
                  </li>
                </ul>
                <Button className="w-full btn-elegant-secondary gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Profile Setup
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(1)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          </div>
          <p className="text-muted-foreground">
            {role === "donor"
              ? "Tell us about your organization and resources"
              : "Tell us about your organization and needs"}
          </p>
        </div>

        <Card className="card-elegant">
          <CardContent className="pt-6 space-y-6">
            {role === "donor" ? (
              <>
                {/* Donor Form */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={donorData.companyName}
                    onChange={e =>
                      setDonorData({ ...donorData, companyName: e.target.value })
                    }
                    placeholder="Your company name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input
                      id="companyWebsite"
                      value={donorData.companyWebsite}
                      onChange={e =>
                        setDonorData({ ...donorData, companyWebsite: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={donorData.industry}
                      onChange={e =>
                        setDonorData({ ...donorData, industry: e.target.value })
                      }
                      placeholder="e.g., Technology, Finance"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={donorData.description}
                    onChange={e =>
                      setDonorData({ ...donorData, description: e.target.value })
                    }
                    placeholder="Tell us about your company and mission"
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Resources You Can Offer *</Label>
                  <div className="space-y-2">
                    {resourceTypeOptions.map(type => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox
                          id={type}
                          checked={donorData.resourceTypes.includes(type)}
                          onCheckedChange={() => handleDonorResourceToggle(type)}
                        />
                        <Label htmlFor={type} className="font-normal cursor-pointer">
                          {type.replace(/_/g, " ").toUpperCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={donorData.contactName}
                      onChange={e =>
                        setDonorData({ ...donorData, contactName: e.target.value })
                      }
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={donorData.contactEmail}
                      onChange={e =>
                        setDonorData({ ...donorData, contactEmail: e.target.value })
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={donorData.contactPhone}
                    onChange={e =>
                      setDonorData({ ...donorData, contactPhone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Non-Profit Form */}
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    value={nonprofitData.organizationName}
                    onChange={e =>
                      setNonprofitData({
                        ...nonprofitData,
                        organizationName: e.target.value,
                      })
                    }
                    placeholder="Your organization name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgWebsite">Website</Label>
                    <Input
                      id="orgWebsite"
                      value={nonprofitData.organizationWebsite}
                      onChange={e =>
                        setNonprofitData({
                          ...nonprofitData,
                          organizationWebsite: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector *</Label>
                    <Select
                      value={nonprofitData.sector}
                      onValueChange={value =>
                        setNonprofitData({ ...nonprofitData, sector: value })
                      }
                    >
                      <SelectTrigger id="sector">
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectorOptions.map(sector => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value={nonprofitData.mission}
                    onChange={e =>
                      setNonprofitData({ ...nonprofitData, mission: e.target.value })
                    }
                    placeholder="What is your organization's mission?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Organization Description</Label>
                  <Textarea
                    id="description"
                    value={nonprofitData.description}
                    onChange={e =>
                      setNonprofitData({
                        ...nonprofitData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Tell us about your work and impact"
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearFounded">Year Founded</Label>
                    <Input
                      id="yearFounded"
                      type="number"
                      value={nonprofitData.yearFounded}
                      onChange={e =>
                        setNonprofitData({
                          ...nonprofitData,
                          yearFounded: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      value={nonprofitData.teamSize}
                      onChange={e =>
                        setNonprofitData({
                          ...nonprofitData,
                          teamSize: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proficiency">Technical Proficiency</Label>
                    <Select
                      value={nonprofitData.technicalProficiency}
                      onValueChange={value =>
                        setNonprofitData({
                          ...nonprofitData,
                          technicalProficiency: value as any,
                        })
                      }
                    >
                      <SelectTrigger id="proficiency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Primary Needs *</Label>
                  <div className="space-y-2">
                    {needsOptions.map(need => (
                      <div key={need} className="flex items-center gap-2">
                        <Checkbox
                          id={need}
                          checked={nonprofitData.primaryNeeds.includes(need)}
                          onCheckedChange={() => handleNonprofitNeedToggle(need)}
                        />
                        <Label htmlFor={need} className="font-normal cursor-pointer">
                          {need.replace(/_/g, " ").toUpperCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={nonprofitData.contactName}
                      onChange={e =>
                        setNonprofitData({
                          ...nonprofitData,
                          contactName: e.target.value,
                        })
                      }
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={nonprofitData.contactEmail}
                      onChange={e =>
                        setNonprofitData({
                          ...nonprofitData,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={nonprofitData.contactPhone}
                    onChange={e =>
                      setNonprofitData({
                        ...nonprofitData,
                        contactPhone: e.target.value,
                      })
                    }
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </>
            )}

            <div className="flex gap-4 pt-6">
              <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>
                Back
              </Button>
              <Button
                className="flex-1 btn-elegant-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Setting up..." : "Complete Setup"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
