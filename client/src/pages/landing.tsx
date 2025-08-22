import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Users, TrendingUp } from "lucide-react";
import { SiX, SiInstagram, SiLinkedin } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-light-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-twitter-dark">SocialHub</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-twitter-blue hover:bg-blue-600 text-white"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-twitter-dark mb-6">
            Manage All Your
            <span className="block text-twitter-blue">Social Media</span>
            in One Place
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Schedule posts, analyze performance, and engage with your audience across Twitter, Instagram, and LinkedIn from a single, powerful dashboard.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-twitter-blue hover:bg-blue-600 text-white px-8 py-4 text-lg"
            data-testid="button-get-started"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-twitter-dark mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive social media management tools designed for modern teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-twitter-blue" />
                </div>
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Schedule posts across all platforms with optimal timing recommendations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-instagram-pink" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track performance metrics and engagement across all your social channels
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-linkedin-blue" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Work together with your team to create, review, and approve content
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-spotify-green" />
                </div>
                <CardTitle>Growth Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get actionable insights to grow your audience and increase engagement
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-twitter-dark mb-4">
            Connect All Your Platforms
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Seamlessly manage your presence across the platforms that matter most
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <SiX className="mx-auto h-16 w-16 text-twitter-blue mb-6" />
                <h3 className="text-xl font-semibold text-twitter-dark mb-2">Twitter</h3>
                <p className="text-gray-600">
                  Schedule tweets, track mentions, and engage with your community
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <SiInstagram className="mx-auto h-16 w-16 text-instagram-pink mb-6" />
                <h3 className="text-xl font-semibold text-twitter-dark mb-2">Instagram</h3>
                <p className="text-gray-600">
                  Plan your feed, schedule posts, and track visual content performance
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="text-center">
                <SiLinkedin className="mx-auto h-16 w-16 text-linkedin-blue mb-6" />
                <h3 className="text-xl font-semibold text-twitter-dark mb-2">LinkedIn</h3>
                <p className="text-gray-600">
                  Share professional content and build your business network
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-twitter-blue">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Social Media Strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already using SocialHub to grow their online presence
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-twitter-blue hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            data-testid="button-start-free-trial"
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            © 2024 SocialHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
