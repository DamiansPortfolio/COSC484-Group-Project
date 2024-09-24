
// SkillsList.jsx
import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

const SkillsList = ({ skills }) => {
    return (
        <Card className="skills-list">
            <CardHeader>
                <h2 className="text-xl font-semibold">Skills</h2>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
            </CardContent>
        </Card>
    );
};

export default SkillsList;

