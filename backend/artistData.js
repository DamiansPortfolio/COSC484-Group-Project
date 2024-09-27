// artistData.js

const artistData = [
    {
        id: "1",
        name: "Jane Doe",
        title: "3D Character Artist | Game Developer",
        location: "Los Angeles, CA",
        memberSince: "2024",
        avatarUrl: "/path/to/avatar.jpg",
        skills: ["3D Modeling", "Texturing", "Rigging"],
        portfolioItems: [
            { imageUrl: "/example_character_model.webp", title: "Character Model 1" },
            { imageUrl: "/example_environment_asset.webp", title: "Environment Asset" },
            { imageUrl: "/example_animation_reel.gif", title: "Animation Reel" },
        ],
        rating: 4.8,
        reviewCount: 69
    },

    {
        id: "2",
        name: "John Smith",
        title: "Concept Artist | Illustrator",
        location: "New York, NY",
        memberSince: "2023",
        avatarUrl: "/path/to/avatar2.jpg",
        skills: ["Digital Art", "Illustration", "Character Design"],
        portfolioItems: [
            { imageUrl: "/example_character_model.webp", title: "Item1" },
            { imageUrl: "/example_character_model.webp", title: "Item2" },
        ],
        rating: 4.7,
        reviewCount: 52
    },
    {
        id: "3",
        name: "Alice Johnson",
        title: "Environment Artist | Texture Specialist",
        location: "San Francisco, CA",
        memberSince: "2022",
        avatarUrl: "/path/to/avatar3.jpg",
        skills: ["3D Modeling", "Texturing", "Lighting", "Shading"],
        portfolioItems: [
            { imageUrl: "/example_environment_asset.webp", title: "Urban Environment" },
            { imageUrl: "/example_character_model.webp", title: "Fantasy Building" },
            { imageUrl: "/example_animation_reel.gif", title: "Nature Scene Reel" },
        ],
        rating: 4.9,
        reviewCount: 85
    },
    {
        id: "4",
        name: "Michael Davis",
        title: "Animation Director | Visual Effects",
        location: "Chicago, IL",
        memberSince: "2021",
        avatarUrl: "/path/to/avatar4.jpg",
        skills: ["Animation", "Visual Effects", "Motion Capture", "Compositing"],
        portfolioItems: [
            { imageUrl: "/example_animation_reel.gif", title: "Sci-fi Animation" },
            { imageUrl: "/example_environment_asset.webp", title: "Exploding Building" },
        ],
        rating: 4.6,
        reviewCount: 77
    },
    {
        id: "5",
        name: "Emily Rodriguez",
        title: "UI/UX Designer | Graphic Artist",
        location: "Austin, TX",
        memberSince: "2020",
        avatarUrl: "/path/to/avatar5.jpg",
        skills: ["UI/UX Design", "Graphic Design", "Prototyping", "Wireframing"],
        portfolioItems: [
            { imageUrl: "/example_uiux_design.webp", title: "App Interface Design" },
            { imageUrl: "/example_graphic_design.webp", title: "Marketing Banner" },
        ],
        rating: 4.8,
        reviewCount: 63
    },
    {
        id: "6",
        name: "Sophia Lee",
        title: "3D Animator | Motion Graphics Artist",
        location: "Seattle, WA",
        memberSince: "2024",
        avatarUrl: "/path/to/avatar6.jpg",
        skills: ["3D Animation", "Motion Graphics", "Compositing", "VFX"],
        portfolioItems: [
            { imageUrl: "/example_animation_reel.gif", title: "Animated Short Film" },
            { imageUrl: "/example_environment_asset.webp", title: "Motion Graphic Teaser" },
        ],
        rating: 4.5,
        reviewCount: 45
    },
    {
        id: "7",
        name: "James Kim",
        title: "Game Developer | Sound Designer",
        location: "Toronto, ON",
        memberSince: "2023",
        avatarUrl: "/path/to/avatar7.jpg",
        skills: ["Game Development", "Sound Design", "Audio Engineering", "Level Design"],
        portfolioItems: [
            { imageUrl: "/example_game_asset.webp", title: "Indie Game Project" },
            { imageUrl: "/example_audio_track.mp3", title: "Soundtrack Composition" },
        ],
        rating: 4.7,
        reviewCount: 72
    },
    {
        id: "8",
        name: "Olivia Martinez",
        title: "Storyboard Artist | Illustrator",
        location: "Miami, FL",
        memberSince: "2022",
        avatarUrl: "/path/to/avatar8.jpg",
        skills: ["Storyboard Art", "Illustration", "Sequential Art", "Character Design"],
        portfolioItems: [
            { imageUrl: "/example_storyboard.webp", title: "Animated Series Storyboard" },
            { imageUrl: "/example_illustration.webp", title: "Concept Art for Short Film" },
        ],
        rating: 4.9,
        reviewCount: 88
    },
    {
        id: "9",
        name: "Daniel Nguyen",
        title: "Visual Effects Artist | Compositor",
        location: "Vancouver, BC",
        memberSince: "2021",
        avatarUrl: "/path/to/avatar9.jpg",
        skills: ["Visual Effects", "Compositing", "Green Screen", "Rotoscoping"],
        portfolioItems: [
            { imageUrl: "/example_vfx_reel.gif", title: "VFX Breakdown Reel" },
            { imageUrl: "/example_compositing_asset.webp", title: "Composited Explosion" },
        ],
        rating: 4.6,
        reviewCount: 64
    },
    {
        id: "10",
        name: "Chloe Harris",
        title: "Character Designer | 2D Animator",
        location: "London, UK",
        memberSince: "2020",
        avatarUrl: "/path/to/avatar10.jpg",
        skills: ["Character Design", "2D Animation", "Storyboarding", "Illustration"],
        portfolioItems: [
            { imageUrl: "/example_character_model.webp", title: "Fantasy Character Design" },
            { imageUrl: "/example_animation_reel.gif", title: "2D Animation Reel" },
        ],
        rating: 4.8,
        reviewCount: 70
    },
    {
        id: "11",
        name: "Benjamin Carter",
        title: "3D Generalist | Texture Artist",
        location: "Berlin, DE",
        memberSince: "2019",
        avatarUrl: "/path/to/avatar11.jpg",
        skills: ["3D Modeling", "Texturing", "UV Mapping", "Shading"],
        portfolioItems: [
            { imageUrl: "/example_environment_asset.webp", title: "Sci-fi Environment" },
            { imageUrl: "/example_character_model.webp", title: "Creature Texture Design" },
        ],
        rating: 4.7,
        reviewCount: 83
    },
    {
        id: "12",
        name: "Ethan Patel",
        title: "Game Designer | Level Designer",
        location: "Melbourne, AU",
        memberSince: "2023",
        avatarUrl: "/path/to/avatar12.jpg",
        skills: ["Game Design", "Level Design", "Prototyping", "Game Mechanics"],
        portfolioItems: [
            { imageUrl: "/example_game_asset.webp", title: "Open World Level Design" },
            { imageUrl: "/example_prototype_asset.webp", title: "Gameplay Prototype" },
        ],
        rating: 4.5,
        reviewCount: 57
    },
    {
        id: "13",
        name: "Mia Roberts",
        title: "Graphic Designer | UI Specialist",
        location: "Paris, FR",
        memberSince: "2020",
        avatarUrl: "/path/to/avatar13.jpg",
        skills: ["Graphic Design", "UI Design", "Typography", "Branding"],
        portfolioItems: [
            { imageUrl: "/example_graphic_design.webp", title: "Brand Logo Design" },
            { imageUrl: "/example_uiux_design.webp", title: "E-commerce UI Design" },
        ],
        rating: 4.9,
        reviewCount: 98
    },
    {
        id: "14",
        name: "Isabella Brown",
        title: "Motion Designer | Animator",
        location: "Tokyo, JP",
        memberSince: "2022",
        avatarUrl: "/path/to/avatar14.jpg",
        skills: ["Motion Design", "Animation", "3D Animation", "Video Editing"],
        portfolioItems: [
            { imageUrl: "/example_animation_reel.gif", title: "Corporate Animation" },
            { imageUrl: "/example_video_editing_asset.mp4", title: "Motion Graphic Ad" },
        ],
        rating: 4.7,
        reviewCount: 76
    },
    {
        id: "15",
        name: "Liam Walker",
        title: "Sound Designer | Composer",
        location: "Sydney, AU",
        memberSince: "2021",
        avatarUrl: "/path/to/avatar15.jpg",
        skills: ["Sound Design", "Audio Engineering", "Composition", "Mixing"],
        portfolioItems: [
            { imageUrl: "/example_audio_track.mp3", title: "Game Soundtrack" },
            { imageUrl: "/example_audio_track.mp3", title: "Ambient Sound Design" },
        ],
        rating: 4.6,
        reviewCount: 65
    },
    {
        id: "16",
        name: "Ivan Goncharuk",
        title: "Game Developer | UI Designer",
        location: "Towson, US",
        memberSince: "2024",
        avatarUrl: "/path/to/avatar15.jpg",
        skills: ["Sound Design", "Audio Engineering", "Composition", "Mixing"],
        portfolioItems: [
            { imageUrl: "/example_audio_track.mp3", title: "Game Soundtrack" },
            { imageUrl: "/example_audio_track.mp3", title: "Ambient Sound Design" },
        ],
        rating: 1.2,
        reviewCount: 42000
    }

];

export default artistData;
