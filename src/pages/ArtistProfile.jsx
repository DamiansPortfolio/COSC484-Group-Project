
// ArtistProfile.jsx
import React from 'react';
import ProfileHeader from '../components/ProfileHeader';
import SkillsList from '../components/SkillsList';
import PortfolioGallery from '../components/PortfolioGallery';
import Reviews from '../components/Reviews';

const ArtistProfile = ({ artistData }) => {
    return (
        <div className="artist-profile space-y-6">
            <ProfileHeader
                name={artistData.name}
                title={artistData.title}
                location={artistData.location}
                memberSince={artistData.memberSince}
                avatarUrl={artistData.avatarUrl}
            />
            <SkillsList skills={artistData.skills} />
            <PortfolioGallery portfolioItems={artistData.portfolioItems} />
            <Reviews rating={artistData.rating} reviewCount={artistData.reviewCount} />
        </div>
    );
};

export default ArtistProfile;