import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { searchUsers, sendMessage } from "../redux/actions/messageActions"

const ProfileHeader = ({ name, title, location, memberSince }) => {
  const { user } = useSelector((state) => state.user)
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isOwnProfile = user?._id === id

  const handleHireClick = async () => {
    try {
      // Search for the user to get their details
      const result = await dispatch(searchUsers("artist"))
      if (result.success) {
        const artistUser = result.data.find((u) => u._id === id)
        if (artistUser) {
          // Send initial message
          await dispatch(
            sendMessage(
              id,
              `Hi ${name}, I'm interested in hiring you for commission work. Would you be available to discuss potential projects?`
            )
          )
          // Navigate to messages page
          navigate("/messages")
        }
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
    }
  }

  return (
    <Card>
      <CardContent className='flex items-center space-x-4 p-6'>
        <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold'>
          {name[0]}
        </div>
        <div className='flex-grow'>
          <h1 className='text-2xl font-bold'>{name}</h1>
          <p className='text-gray-500'>{title}</p>
          <p className='text-sm text-gray-400'>
            {location} | Member since {memberSince}
          </p>
        </div>
        {!isOwnProfile && user?.role === "requester" && (
          <Button
            onClick={handleHireClick}
            className='bg-green-500 hover:bg-green-600 text-white'
          >
            Hire Me
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileHeader
