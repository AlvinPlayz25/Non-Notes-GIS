import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Award, Shield, FileText, Heart } from "lucide-react";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About NonNotes
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
            Empowering students to learn together through collaborative
            note-sharing
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              NonNotes was created with a simple mission: to help students learn
              more effectively by sharing knowledge. We believe that education
              is a collaborative journey, and that students can benefit
              immensely from accessing diverse perspectives and study materials.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our platform enables students in grades 6-12 to discover, share,
              and access class notes organized by subject and grade level,
              creating a community of learners who support each other's academic
              growth.
            </p>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Join Our Community
            </Button>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
              alt="Students studying together"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Makes NonNotes Special
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Organized Content
                </h3>
                <p className="text-gray-700">
                  Notes are neatly categorized by grade level and subject,
                  making it easy to find exactly what you need.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Community-Driven
                </h3>
                <p className="text-gray-700">
                  Our platform thrives on student contributions, creating a
                  diverse library of study materials.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Verified Content
                </h3>
                <p className="text-gray-700">
                  Our verification system highlights high-quality notes that
                  have been reviewed for accuracy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Trust & Safety
              </h3>
              <p className="text-gray-700">
                We prioritize creating a safe environment where students can
                trust the content they access. Our verification system and
                community guidelines ensure quality and accuracy.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Educational Excellence
              </h3>
              <p className="text-gray-700">
                We believe in the power of shared knowledge to elevate
                everyone's learning experience. Our platform is designed to
                complement classroom education and support academic success.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="rounded-full bg-yellow-100 p-3 w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Inclusivity
              </h3>
              <p className="text-gray-700">
                Education should be accessible to all. We strive to create a
                platform where students from diverse backgrounds can find
                resources that meet their needs.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="rounded-full bg-red-100 p-3 w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Community Support
              </h3>
              <p className="text-gray-700">
                We foster a supportive community where students help each other
                succeed. By sharing notes and knowledge, we create a
                collaborative learning environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join NonNotes?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Become part of our growing community of students sharing knowledge
            and supporting each other's academic journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 hover:bg-blue-50"
              size="lg"
            >
              Sign Up Now
            </Button>
            <Button
              onClick={() => navigate("/notes")}
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
              size="lg"
            >
              Browse Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
