import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useState } from "react"; // Add this import
import { useUserContext } from "@/context/AuthContext";
import { useFollowUser } from "@/lib/react-query/queriesAndMutations";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser } = useUserContext();
  const { mutate: followUser } = useFollowUser();
  // Add local state to track following status
  const [isFollowing, setIsFollowing] = useState(user.followers?.includes(currentUser.id));

  const handleFollow = () => {
    setIsFollowing(!isFollowing); // Toggle state immediately for UI feedback
    
    followUser({ 
      userId: user.$id,
      followerId: currentUser.id 
    });
  };

  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button 
        type="button" 
        size="sm" 
        className={`shad-button_primary px-5 ${isFollowing ? 'bg-light-4' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          handleFollow();
        }}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </Link>
  );
};

export default UserCard;