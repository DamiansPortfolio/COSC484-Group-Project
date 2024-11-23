import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SkillsList = ({ skills }) => {
  // Helper function to check if it's a valid skills structure
  const isValidSkillsStructure = (skills) => {
    // If it's an array, return false as we expect an object with primary/secondary
    if (Array.isArray(skills)) return false

    // If it's not an object, return false
    if (!skills || typeof skills !== "object") return false

    // Check if it has primary or secondary arrays
    const hasPrimary = "primary" in skills && Array.isArray(skills.primary)
    const hasSecondary =
      "secondary" in skills && Array.isArray(skills.secondary)

    return hasPrimary || hasSecondary
  }

  // Helper function to validate primary skill object
  const isValidPrimarySkill = (skill) => {
    return (
      skill &&
      typeof skill === "object" &&
      typeof skill.name === "string" &&
      (!skill.level || typeof skill.level === "string")
    )
  }

  // Helper function to validate secondary skill
  const isValidSecondarySkill = (skill) => {
    return typeof skill === "string" && skill.trim().length > 0
  }

  // Early return if skills is invalid
  if (!isValidSkillsStructure(skills)) {
    return <DefaultSkillsCard />
  }

  // Get arrays with validation
  const primarySkills = Array.isArray(skills.primary)
    ? skills.primary.filter(isValidPrimarySkill)
    : []

  const secondarySkills = Array.isArray(skills.secondary)
    ? skills.secondary.filter(isValidSecondarySkill)
    : []

  // If no valid skills in either array, show default card
  if (primarySkills.length === 0 && secondarySkills.length === 0) {
    return <DefaultSkillsCard />
  }

  return (
    <Card>
      <CardContent className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Skills</h2>
        <div className='space-y-4'>
          {/* Primary Skills */}
          {primarySkills.length > 0 && (
            <div>
              <h3 className='text-sm font-medium mb-2'>Primary Skills</h3>
              <div className='flex flex-wrap gap-2'>
                {primarySkills.map((skill, index) => (
                  <Badge
                    key={`primary-${index}-${skill.name}`}
                    variant='secondary'
                    className='px-3 py-1 rounded-full'
                  >
                    {skill.name}
                    {skill.level && (
                      <span className='ml-1 text-xs opacity-75'>
                        ({skill.level})
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Skills */}
          {secondarySkills.length > 0 && (
            <div>
              <h3 className='text-sm font-medium mb-2'>Secondary Skills</h3>
              <div className='flex flex-wrap gap-2'>
                {secondarySkills.map((skill, index) => (
                  <Badge
                    key={`secondary-${index}-${skill}`}
                    variant='outline'
                    className='px-3 py-1 rounded-full'
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Separate component for the "No skills" state
const DefaultSkillsCard = () => (
  <Card>
    <CardContent className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>Skills</h2>
      <p>No skills available</p>
    </CardContent>
  </Card>
)

export default SkillsList
