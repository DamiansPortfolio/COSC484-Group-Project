// ArtistProfile.jsx
import ProfileHeader from '../components/ProfileHeader';
import SkillsList from '../components/SkillsList';
import PortfolioGallery from '../components/PortfolioGallery';
import ReviewsSection from '../components/ReviewsSection';

const ArtistProfile = ({ artistData }) => {
    return (
        <div className="space-y-6">
            <ProfileHeader
                name={artistData.name}
                title={artistData.title}
                location={artistData.location}
                memberSince={artistData.memberSince}
                avatarUrl={artistData.avatarUrl}
            />
            <SkillsList skills={artistData.skills} />
            <PortfolioGallery portfolioItems={artistData.portfolioItems} />
            <ReviewsSection rating={artistData.rating} reviewCount={artistData.reviewCount} />
        </div>
    );
};

export default ArtistProfile;