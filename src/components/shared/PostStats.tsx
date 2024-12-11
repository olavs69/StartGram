import { Models } from "appwrite";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useGetComments,
  useAddComment,
} from "@/lib/react-query/queriesAndMutations";
import { Button, Input } from "../ui";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState("");
  
  const { data: comments, isPending: isLoadingComments } = useGetComments(post.$id);
  const { mutate: addComment } = useAddComment();

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    addComment({
      content: comment,
      postId: post.$id,
      userId: userId
    });

    setComment("");
    setIsCommenting(false);
  };

  const { mutate: likePost } = useLikePost();

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };


  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <>
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer hover:scale-110"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={"/assets/icons/saved.svg"}
          alt="comment"
          width={20}
          height={20}
          className="cursor-pointer hover:scale-110"
          onClick={() => setIsCommenting(!isCommenting)}
        />
        <p className="small-medium lg:base-medium">
          {comments?.documents.length || 0}
        </p>

      </div>
      
    </div>
    {isCommenting && (
        <div className=" bg-dark-2 p-4 rounded-lg">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="shad-input"
            />
            <Button type="submit" disabled={comment.trim() === ""}>
              Post
            </Button>
          </form>
          
          <div className="mt-4 max-h-40 overflow-y-auto">
            {isLoadingComments ? (
              <p>Loading comments...</p>
            ) : (
              comments?.documents.map((comment: Models.Document) => (
                <div key={comment.$id} className="flex gap-2 mb-2">
                  <img
                    src={comment.user.imageUrl}
                    alt="user"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-light-1 text-sm font-semibold">
                      {comment.user.name}
                    </p>
                    <p className="text-light-2 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        )}
      </>
  );
};

export default PostStats;