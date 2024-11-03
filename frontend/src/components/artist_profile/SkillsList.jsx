import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SkillsList = ({ skills = [] }) => {
  return (
    <Card>
      <CardContent className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Skills</h2>
        <div className='flex flex-wrap gap-2'>
          {Array.isArray(skills) ? (
            skills.map((skill, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='px-3 py-1 rounded-full'
              >
                {skill}
              </Badge>
            ))
          ) : (
            <p>No skills available</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SkillsList
