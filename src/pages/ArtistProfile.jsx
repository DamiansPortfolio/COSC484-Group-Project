import React from 'react';
import { useParams } from 'react-router-dom';  // Import useParams to get the artist ID from the URL
import ProfileHeader from '../components/artist_profile/ProfileHeader';
import SkillsList from '../components/artist_profile/SkillsList';
import PortfolioGallery from '../components/artist_profile/PortfolioGallery';
import ReviewsSection from '../components/artist_profile/ReviewsSection';
import PageLayout from '../components/PageLayout';
import artistData from '../artistData';  // Import artist data

const ArtistProfile = () => {
    const { id } = useParams();  // Get the artist ID from the route parameters
    const artist = artistData.find(artist => artist.id === id);  // Find the artist by ID

    // Handle case where artist is not found
    if (!artist) {
        return <div>Artist not found</div>;
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
