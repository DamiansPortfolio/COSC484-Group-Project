import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileHeader from '../components/artist_profile/ProfileHeader';
import SkillsList from '../components/artist_profile/SkillsList';
import PortfolioGallery from '../components/artist_profile/PortfolioGallery';
import ReviewsSection from '../components/artist_profile/ReviewsSection';
import PageLayout from '../components/PageLayout';
import artistData from '../artistData';

const ArtistProfile = () => {
    const { id } = useParams();
    const artist = artistData.find(artist => artist.id === id);

    if (!artist) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center h-screen text-center">
                    <h1 className="text-3xl font-bold mb-4">Artist Not Found</h1>
                    <p className="text-gray-600 mb-8">Sorry, we couldn't find the artist you're looking for.</p>
                    <Link to="/" className="text-blue-500 underline">
                        Go back to Dashboard
                    </Link>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="space-y-6">
                <ProfileHeader
                    name={artist.name}
                    title={artist.title}
                    location={artist.location}
                    memberSince={artist.memberSince}
                    avatarUrl={artist.avatarUrl}
                />
                <SkillsList skills={artist.skills} />
                <PortfolioGallery portfolioItems={artist.portfolioItems} />
                <ReviewsSection rating={artist.rating} reviewCount={artist.reviewCount} />
            </div>
        </PageLayout>
    );
};

export default ArtistProfile;
