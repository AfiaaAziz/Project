import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCreateComment } from "../hooks/useCampaigns";
import { Campaign } from "../types";
import { formatDistanceToNow } from "date-fns";

interface CampaignCommentsProps {
  campaign: Campaign;
}

const CampaignComments: React.FC<CampaignCommentsProps> = ({ campaign }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const createCommentMutation = useCreateComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate(
      {
        campaignId: campaign.id,
        content: newComment,
      },
      {
        onSuccess: () => {
          setNewComment("");
        },
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comments ({campaign.comments?.length || 0})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start space-x-3">
            <img
              src={
                user.user_metadata?.avatar_url ||
                `https://ui-avatars.com/api/?name=${
                  user.user_metadata?.full_name || "User"
                }&background=random`
              }
              alt="Your avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={3}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="mt-2 px-5 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {createCommentMutation.isPending
                  ? "Posting..."
                  : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-600 bg-gray-50 p-4 rounded-lg mb-8">
          You must be logged in to post a comment.
        </p>
      )}

      <div className="space-y-6">
        {campaign.comments && campaign.comments.length > 0
          ? campaign.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <img
                  src={
                    comment.user?.avatar_url ||
                    `https://ui-avatars.com/api/?name=${
                      comment.user?.full_name || "User"
                    }&background=random`
                  }
                  alt={`${comment.user?.full_name}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">
                      {comment.user?.full_name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at))} ago
                    </p>
                  </div>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          : !user && <p className="text-gray-500">No comments yet.</p>}
        {campaign.comments?.length === 0 && user && (
          <p className="text-gray-500">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CampaignComments;
