// ProfileHeader.jsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const ProfileHeader = ({ name, title, location, memberSince, avatarUrl }) => {
    return (
        <Card className="profile-header">
            <CardContent className="flex items-center space-x-4 p-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold">{name}</h1>
                    <p className="text-gray-500">{title}</p>
                    <p className="text-sm text-gray-400">{location} | Member since {memberSince}</p>
                </div>
                <Button>Hire Me</Button>
            </CardContent>
        </Card>
    );
};

export default ProfileHeader;
