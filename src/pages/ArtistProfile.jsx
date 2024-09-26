// ArtistProfile.jsx
import ProfileHeader from '../components/artist_profile/ProfileHeader';
import SkillsList from '../components/artist_profile/SkillsList';
import PortfolioGallery from '../components/artist_profile/PortfolioGallery';
import ReviewsSection from '../components/artist_profile/ReviewsSection';
import PageLayout from '../components/PageLayout'

const ArtistProfile = ({ artistData }) => {
    return (
        <PageLayout>
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
        </PageLayout>
    );
};

export default ArtistProfile;