import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiX, SiInstagram, SiLinkedin } from "react-icons/si";
import { Upload, Calendar, Brain, Target, Eye, MessageSquare, TrendingUp, Lightbulb, Hash, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Debounced content analysis
  const analyzeContent = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 10) {
      setAnalysis(null);
      return;
    }

    setAnalysisLoading(true);
    try {
      const result = await apiRequest('POST', '/api/content/analyze', { content: text });
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze content:', error);
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeContent(content);
    }, 1000); // Analyze after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [content, analyzeContent]);

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto" data-testid="modal-create-post">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-twitter-dark flex items-center">
            <Brain className="h-5 w-5 mr-2 text-twitter-blue" />
            Create New Post with AI Optimization
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Creation - Left Side */}
          <div className="lg:col-span-2 space-y-6">
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
                rows={6}
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
                {analysis && (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-3 w-3 text-twitter-blue" />
                    <span className="text-xs text-twitter-blue">AI analyzing...</span>
                  </div>
                )}
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

          {/* AI Analysis Panel - Right Side */}
          <div className="lg:col-span-1">
            <Card className="sticky top-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-twitter-blue" />
                  AI Content Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-twitter-blue"></div>
                    <span className="ml-2 text-sm text-gray-500">Analyzing...</span>
                  </div>
                )}

                {analysis && !analysisLoading && (
                  <Tabs defaultValue="scores" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="scores" className="text-xs">Scores</TabsTrigger>
                      <TabsTrigger value="suggestions" className="text-xs">Tips</TabsTrigger>
                      <TabsTrigger value="hashtags" className="text-xs">Tags</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scores" className="space-y-3">
                      {/* Overall Score */}
                      <div className={cn("p-3 rounded-lg", getScoreBgColor(analysis.overallScore))}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className={cn("text-lg font-bold", getScoreColor(analysis.overallScore))}>
                            {analysis.overallScore}%
                          </span>
                        </div>
                        <Progress value={analysis.overallScore} className="h-2" />
                      </div>

                      {/* Individual Scores */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Target className="h-3 w-3 mr-1 text-blue-500" />
                            <span className="text-xs">Engagement</span>
                          </div>
                          <span className={cn("text-xs font-medium", getScoreColor(analysis.engagementScore))}>
                            {analysis.engagementScore}%
                          </span>
                        </div>
                        <Progress value={analysis.engagementScore} className="h-1" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                            <span className="text-xs">SEO</span>
                          </div>
                          <span className={cn("text-xs font-medium", getScoreColor(analysis.seoScore))}>
                            {analysis.seoScore}%
                          </span>
                        </div>
                        <Progress value={analysis.seoScore} className="h-1" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1 text-purple-500" />
                            <span className="text-xs">Readability</span>
                          </div>
                          <span className={cn("text-xs font-medium", getScoreColor(analysis.readabilityScore))}>
                            {analysis.readabilityScore}%
                          </span>
                        </div>
                        <Progress value={analysis.readabilityScore} className="h-1" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1 text-orange-500" />
                            <span className="text-xs">Brand Voice</span>
                          </div>
                          <span className={cn("text-xs font-medium", getScoreColor(analysis.brandVoiceScore))}>
                            {analysis.brandVoiceScore}%
                          </span>
                        </div>
                        <Progress value={analysis.brandVoiceScore} className="h-1" />
                      </div>
                    </TabsContent>

                    <TabsContent value="suggestions" className="space-y-2">
                      {JSON.parse(analysis.suggestions || '[]').length > 0 ? (
                        JSON.parse(analysis.suggestions).map((suggestion: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded text-xs">
                            <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{suggestion}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <Lightbulb className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Great job! Your content looks good.</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="hashtags" className="space-y-3">
                      {/* AI Suggested Hashtags */}
                      <div>
                        <div className="flex items-center mb-2">
                          <Hash className="h-3 w-3 mr-1 text-twitter-blue" />
                          <span className="text-xs font-medium">AI Suggestions</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.hashtags?.map((tag: string, index: number) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs cursor-pointer hover:bg-blue-100"
                              onClick={() => setContent(prev => prev + ` ${tag}`)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Best Posting Times */}
                      <div>
                        <div className="flex items-center mb-2">
                          <Clock className="h-3 w-3 mr-1 text-green-500" />
                          <span className="text-xs font-medium">Optimal Times</span>
                        </div>
                        {selectedPlatforms.map(platform => {
                          const times = JSON.parse(analysis.bestPostingTimes || '{}')[platform]?.weekdays || [];
                          return (
                            <div key={platform} className="mb-2">
                              <p className="text-xs font-medium capitalize text-gray-600">{platform}</p>
                              <div className="flex flex-wrap gap-1">
                                {times.slice(0, 2).map((time: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {time}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}

                {!analysis && !analysisLoading && content.length > 0 && (
                  <div className="text-center py-8">
                    <Brain className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Keep typing to see AI analysis...</p>
                  </div>
                )}

                {!analysis && !analysisLoading && content.length === 0 && (
                  <div className="text-center py-8">
                    <Brain className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Start writing to get AI suggestions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
