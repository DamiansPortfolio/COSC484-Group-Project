import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Calendar, DollarSign, Clock, Users } from "lucide-react";

// Job Status Detail component
// Renders individual job detail with icon and label
const JobStatusDetail = ({ label, value, icon: Icon }) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-5 h-5 text-gray-500" />
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

// Applicant Card component
// Displays individual applicant information
const ApplicantCard = ({ applicant, onProfileClick }) => {
  const user = applicant.profile?.userId;

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
      <Avatar
        className="cursor-pointer"
        onClick={() => applicant.profile?._id && onProfileClick(applicant.profile._id)}
      >
        <AvatarImage src={user?.avatarUrl || ""} />
        <AvatarFallback>{user?.username?.[0] || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium">{user?.username || "Name Not Available"}</h3>
        <p className="text-sm text-gray-500">
          Applied: {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : "N/A"}
        </p>
      </div>
      <Badge>{applicant.status || "Status Unknown"}</Badge>
    </div>
  );
};

// Job Status main component
// Displays detailed information about a specific job and its applicants
const JobStatus = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetches Job Details
  // Retrieves job information, applications, and applicant profiles
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        // Fetch detailed application and artist profile information
        const data = await response.json();
        const applications = await Promise.all(
          data.applications.map(async (applicationId) => {
            const applicationResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/applications/${applicationId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!applicationResponse.ok) {
              throw new Error("Failed to fetch application details");
            }

            const application = await applicationResponse.json();

            // Fetch artist profile details
            const artistResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/artists/${application.artistProfileId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!artistResponse.ok) {
              throw new Error(`Failed to fetch profile for artist ${application.artistProfileId}`);
            }

            const artistProfile = await artistResponse.json();

            return {
              ...application,
              profile: artistProfile,
            };
          })
        );

        // Update job state with fetched data
        setJob({ ...data, applications });
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Navigate to artist profile
  const handleProfileClick = (artistId) => {
    navigate(`/profile/${artistId}`);
  };

   // Loading State Handler
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error State Handler
  if (error || !job) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">{error || "Job not found"}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

   // Main Component Render
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-gray-600">{job.description}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JobStatusDetail label="Category" value={job.category} icon={Users} />
            <JobStatusDetail label="Type" value={job.type} icon={Clock} />
            <JobStatusDetail
              label="Budget"
              value={`${job.budget?.currency || "USD"} ${job.budget?.min} - ${job.budget?.max}`}
              icon={DollarSign}
            />
            <JobStatusDetail
              label="Timeline"
              value={`${new Date(job.timeline?.startDate).toLocaleDateString()} - ${new Date(
                job.timeline?.deadline
              ).toLocaleDateString()}`}
              icon={Calendar}
            />
          </div>

          {job.requirements?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, index) => (
                  <Badge key={index} variant="secondary">
                    {req.skillRequired} ({req.experienceLevel})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applicants ({job.applications?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {job.applications?.length > 0 ? (
                job.applications.map((application) => (
                  <ApplicantCard
                    key={application._id}
                    applicant={application}
                    onProfileClick={handleProfileClick}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">No applications yet</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobStatus;
