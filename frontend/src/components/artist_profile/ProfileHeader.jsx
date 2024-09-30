// ProfileHeader.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProfileHeader = ({ name, title, location, memberSince, avatarUrl }) => {
    return (
        <Card>
            <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold">
                    {name[0]}
                </div>
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold">{name}</h1>
                    <p className="text-gray-500">{title}</p>
                    <p className="text-sm text-gray-400">{location} | Member since {memberSince}</p>
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-white">Hire Me</Button>
            </CardContent>
        </Card>
    );
};

export default ProfileHeader;