import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiX, SiInstagram, SiLinkedin } from "react-icons/si";
import { Upload, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostModal({ isOpen, onClose }: PostModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter']);
  const [content, setContent] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; platforms: string[]; status: string; scheduledFor?: Date }) => {
      return await apiRequest('POST', '/api/posts', postData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: isScheduled ? "Post scheduled successfully!" : "Post created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      if (isScheduled) {
        queryClient.invalidateQueries({ queryKey: ['/api/posts/scheduled'] });
      }
      onClose();
      setContent('');
      setSelectedPlatforms(['twitter']);
      setIsScheduled(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: SiX, color: 'twitter-blue' },
    { id: 'instagram', name: 'Instagram', icon: SiInstagram, color: 'instagram-pink' },
    { id: 'linkedin', name: 'LinkedIn', icon: SiLinkedin, color: 'linkedin-blue' },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error", 
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content: content.trim(),
      platforms: selectedPlatforms,
      status: isScheduled ? 'scheduled' : 'published',
      scheduledFor: isScheduled ? new Date(Date.now() + 60 * 60 * 1000) : undefined, // Schedule for 1 hour from now
    });
  };

  const maxLength = 280;
  const remainingChars = maxLength - content.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-testid="modal-create-post">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-twitter-dark">Create New Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Platform Selection */}
          <div>
            <Label className="text-sm font-medium text-twitter-dark mb-2 block">Select Platforms</Label>
            <div className="flex space-x-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                
                return (
                  <Button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    variant="outline"
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium",
                      isSelected
                        ? `border-2 border-${platform.color} text-${platform.color} bg-blue-50`
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    )}
                    data-testid={`button-platform-${platform.id}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {platform.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <Label className="text-sm font-medium text-twitter-dark mb-2 block">Content</Label>
            <Textarea 
              rows={4}
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-twitter-blue focus:border-transparent resize-none"
              data-testid="textarea-post-content"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className={cn(
                "text-xs",
                remainingChars < 0 ? "text-red-500" : "text-gray-500"
              )} data-testid="text-character-count">
                {remainingChars} characters remaining
              </span>
              <Button variant="link" className="text-twitter-blue hover:underline text-xs p-0" data-testid="button-add-hashtags">
                Add hashtags
              </Button>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <Label className="text-sm font-medium text-twitter-dark mb-2 block">Media</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-twitter-blue transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Drag & drop images or videos</p>
              <Button variant="link" className="text-twitter-blue text-sm hover:underline p-0" data-testid="button-browse-files">
                Browse files
              </Button>
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <Label className="text-sm font-medium text-twitter-dark mb-2 block">Schedule</Label>
            <div className="flex space-x-3">
              <Button 
                type="button"
                onClick={() => setIsScheduled(false)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg",
                  !isScheduled
                    ? "bg-twitter-blue text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                )}
                data-testid="button-post-now"
              >
                Post Now
              </Button>
              <Button 
                type="button"
                onClick={() => setIsScheduled(true)}
                variant="outline"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg flex items-center",
                  isScheduled
                    ? "border-twitter-blue text-twitter-blue bg-blue-50"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
                data-testid="button-schedule"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={createPostMutation.isPending || remainingChars < 0}
              className="bg-twitter-blue hover:bg-blue-600 text-white"
              data-testid="button-submit-post"
            >
              {createPostMutation.isPending 
                ? "Creating..." 
                : isScheduled 
                  ? "Schedule Post" 
                  : "Post Now"
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
