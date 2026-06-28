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
import { IconArrowRight, IconCheck, IconBuilding, IconUsers } from "@tabler/icons-react";

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
      <div className="min-h-screen bg-page">
        <div className="bg-card border-b border-gray-300 py-8">
          <div className="container-page">
            <h1 className="text-3xl font-medium text-gray-900">Join Tech-Equity Bridge</h1>
            <p className="text-gray-700 mt-1">Choose your role to get started</p>
          </div>
        </div>

        <div className="container-page py-12">
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donor Card */}
            <button
              onClick={() => handleRoleSelect("donor")}
              className="card text-left hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-center w-12 h-12 rounded-lg bg-primary-light">
                  <IconBuilding className="w-6 h-6 text-primary" />
                </div>
                <IconArrowRight className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tech Donor</h3>
              <p className="text-sm text-gray-700 mb-4">
                Share your AI agents, tools, and resources with non-profits
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  List resources and AI agents
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  Track impact and reach
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  Build your CSR narrative
                </li>
              </ul>
            </button>

            {/* Non-Profit Card */}
            <button
              onClick={() => handleRoleSelect("nonprofit")}
              className="card text-left hover:border-secondary transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-center w-12 h-12 rounded-lg bg-secondary-light">
                  <IconUsers className="w-6 h-6 text-secondary" />
                </div>
                <IconArrowRight className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Non-Profit</h3>
              <p className="text-sm text-gray-700 mb-4">
                Access digital resources and AI tools to amplify your mission
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                  Browse resource marketplace
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                  Request resources instantly
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                  AI grant writing assistant
                </li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Profile Setup
  return (
    <div className="min-h-screen bg-page">
      <div className="bg-card border-b border-gray-300 py-6">
        <div className="container-page">
          <h1 className="text-2xl font-medium text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-700 mt-1">
            {role === "donor"
              ? "Tell us about your organization and resources"
              : "Tell us about your organization and needs"}
          </p>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setStep(1)}
            className="text-primary hover:underline text-sm font-medium mb-8"
          >
            ← Back
          </button>

          <div className="card">
            <div className="space-y-6">
              {role === "donor" ? (
                <>
                  {/* Donor Form */}
                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-900">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      value={donorData.companyName}
                      onChange={e =>
                        setDonorData({ ...donorData, companyName: e.target.value })
                      }
                      placeholder="Your company name"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyWebsite" className="text-sm font-medium text-gray-900">
                        Website
                      </Label>
                      <Input
                        id="companyWebsite"
                        value={donorData.companyWebsite}
                        onChange={e =>
                          setDonorData({ ...donorData, companyWebsite: e.target.value })
                        }
                        placeholder="https://example.com"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="industry" className="text-sm font-medium text-gray-900">
                        Industry
                      </Label>
                      <Input
                        id="industry"
                        value={donorData.industry}
                        onChange={e =>
                          setDonorData({ ...donorData, industry: e.target.value })
                        }
                        placeholder="e.g., Technology, Finance"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                      Company Description
                    </Label>
                    <Textarea
                      id="description"
                      value={donorData.description}
                      onChange={e =>
                        setDonorData({ ...donorData, description: e.target.value })
                      }
                      placeholder="Tell us about your company and mission"
                      className="mt-2 min-h-24"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-3 block">
                      Resources You Can Offer *
                    </Label>
                    <div className="space-y-2">
                      {resourceTypeOptions.map(type => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            id={type}
                            checked={donorData.resourceTypes.includes(type)}
                            onCheckedChange={() => handleDonorResourceToggle(type)}
                          />
                          <Label htmlFor={type} className="font-normal cursor-pointer text-sm">
                            {type.replace(/_/g, " ").toUpperCase()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName" className="text-sm font-medium text-gray-900">
                        Contact Name
                      </Label>
                      <Input
                        id="contactName"
                        value={donorData.contactName}
                        onChange={e =>
                          setDonorData({ ...donorData, contactName: e.target.value })
                        }
                        placeholder="Your name"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-900">
                        Contact Email
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={donorData.contactEmail}
                        onChange={e =>
                          setDonorData({ ...donorData, contactEmail: e.target.value })
                        }
                        placeholder="your@email.com"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Non-Profit Form */}
                  <div>
                    <Label htmlFor="orgName" className="text-sm font-medium text-gray-900">
                      Organization Name *
                    </Label>
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
                      className="mt-2"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orgWebsite" className="text-sm font-medium text-gray-900">
                        Website
                      </Label>
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
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sector" className="text-sm font-medium text-gray-900">
                        Sector *
                      </Label>
                      <Select
                        value={nonprofitData.sector}
                        onValueChange={value =>
                          setNonprofitData({ ...nonprofitData, sector: value })
                        }
                      >
                        <SelectTrigger id="sector" className="mt-2">
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

                  <div>
                    <Label htmlFor="mission" className="text-sm font-medium text-gray-900">
                      Organization Mission
                    </Label>
                    <Textarea
                      id="mission"
                      value={nonprofitData.mission}
                      onChange={e =>
                        setNonprofitData({ ...nonprofitData, mission: e.target.value })
                      }
                      placeholder="Describe your organization's mission"
                      className="mt-2 min-h-24"
                    />
                  </div>

                  <div>
                    <Label htmlFor="techProf" className="text-sm font-medium text-gray-900">
                      Technical Proficiency
                    </Label>
                    <Select
                      value={nonprofitData.technicalProficiency}
                      onValueChange={value =>
                        setNonprofitData({
                          ...nonprofitData,
                          technicalProficiency: value as any,
                        })
                      }
                    >
                      <SelectTrigger id="techProf" className="mt-2">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-3 block">
                      Primary Needs
                    </Label>
                    <div className="space-y-2">
                      {needsOptions.map(need => (
                        <div key={need} className="flex items-center gap-2">
                          <Checkbox
                            id={need}
                            checked={nonprofitData.primaryNeeds.includes(need)}
                            onCheckedChange={() => handleNonprofitNeedToggle(need)}
                          />
                          <Label htmlFor={need} className="font-normal cursor-pointer text-sm">
                            {need.replace(/_/g, " ").toUpperCase()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? "Completing..." : "Complete Profile"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
