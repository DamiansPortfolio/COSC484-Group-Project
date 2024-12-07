import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import QuickStats from "../components/dashboard/QuickStats"
import { checkAuthStatus } from "../redux/actions/userActions"

const ApplicationPreviewCard = ({ application }) => {
  const navigate = useNavigate()
  const jobData = application.job || application.jobId || {};

  // Handle different possible data structures
  const getJobTitle = () => {
    if (typeof jobData === 'string') return 'Job Details Available on Click';
    return jobData.title || 'Untitled Job';
  };

  const getJobCategory = () => {
    if (typeof jobData === 'string') return null;
    return jobData.category;
  };

  const getJobType = () => {
    if (typeof jobData === 'string') return null;
    return jobData.type;
  };

  const getRequesterName = () => {
    if (typeof jobData === 'string') return null;
    return jobData.requesterId?.userId?.username || 
           jobData.requester?.username || 
           'Unknown Requester';
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/applications/${application._id}`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{getJobTitle()}</h3>
          <Badge variant="outline" className="text-sm">
            {application.status || 'pending'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {getJobCategory() && (
              <Badge variant="secondary">{getJobCategory()}</Badge>
            )}
            {getJobType() && (
              <Badge variant="secondary">{getJobType()}</Badge>
            )}
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Proposed Amount: {application.proposedAmount} USD
          </p>

          {getRequesterName() && (
            <p className="text-sm text-gray-600">
              Posted by: {getRequesterName()}
            </p>
          )}

          <p className="text-sm text-gray-500">
            Applied: {new Date(application.appliedAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

const MyApplications = () => {
  const { user, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user && !loading) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, user, loading])

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?._id) return;

      try {
        const token = localStorage.getItem("token")
        console.log("Fetching applications for user:", user._id);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/artists/${user._id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        console.log("Received applications data:", data);

        // Ensure we always have an array
        const applicationArray = Array.isArray(data) ? data : 
                               data.applications ? data.applications :
                               data.items ? data.items : [];

        // Filter out any invalid entries
        const validApplications = applicationArray.filter(app => app && app._id);
        
        setApplications(validApplications);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
      } finally {
        setApplicationsLoading(false);
      }
    }

    if (user) {
      fetchApplications()
    }
  }, [user])

  if (loading || applicationsLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to load content. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600">Track your job applications</p>
      </header>

      <div className="space-y-6">
        <QuickStats userRole="artist" />
        
        <Card>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-1">
                {applications.length === 0 ? (
                  <p className="text-center text-gray-500 col-span-2">
                    No applications found
                  </p>
                ) : (
                  applications.map((application) => (
                    <ApplicationPreviewCard 
                      key={application._id} 
                      application={application} 
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MyApplications