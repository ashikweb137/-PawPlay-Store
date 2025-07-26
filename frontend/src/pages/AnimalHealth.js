import React from 'react';
import { Clock, User, ArrowRight, Heart, Brain, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { healthArticles, benefits } from '../data/mockData';

const AnimalHealth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Animal Health & Wellness Center
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Expert advice, health tips, and comprehensive guides to keep your beloved pets 
              happy, healthy, and thriving through proper toy selection and enrichment activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 px-8">
                Browse Health Articles
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-purple-300 text-purple-100 hover:bg-purple-800/50 px-8"
              >
                Ask Our Experts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Health Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Proper Toys Support Animal Health
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The right toys aren't just fun - they're essential for your pet's physical and mental wellbeing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-purple-100">
                <CardContent className="p-8">
                  <div className="text-5xl mb-6">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Health Stats */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">85%</div>
                <p className="text-purple-100">of behavioral issues can be reduced with proper mental stimulation</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">60%</div>
                <p className="text-purple-100">improvement in physical activity with engaging toys</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">92%</div>
                <p className="text-purple-100">of pet owners report happier pets with regular enrichment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Health Articles</h2>
              <p className="text-xl text-gray-600">
                Expert insights and practical advice for optimal animal health
              </p>
            </div>
            <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {healthArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border-purple-100">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                      {article.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      {article.readTime}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(article.publishDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  <Button 
                    variant="ghost" 
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-auto"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Health Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse Health Topics by Animal
            </h2>
            <p className="text-xl text-gray-600">
              Specialized advice tailored to your pet's specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                animal: 'Dogs',
                icon: '🐕',
                topics: ['Exercise Requirements', 'Mental Stimulation', 'Dental Health', 'Joint Care'],
                color: 'from-blue-500 to-blue-600'
              },
              {
                animal: 'Cats',
                icon: '🐱',
                topics: ['Indoor Enrichment', 'Hunting Instincts', 'Stress Reduction', 'Play Therapy'],
                color: 'from-green-500 to-green-600'
              },
              {
                animal: 'Birds',
                icon: '🦜',
                topics: ['Foraging Behavior', 'Wing Exercise', 'Social Interaction', 'Beak Health'],
                color: 'from-yellow-500 to-orange-500'
              },
              {
                animal: 'Small Animals',
                icon: '🐹',
                topics: ['Habitat Enrichment', 'Exercise Wheels', 'Chewing Needs', 'Social Play'],
                color: 'from-pink-500 to-pink-600'
              },
              {
                animal: 'Reptiles',
                icon: '🦎',
                topics: ['Basking Behavior', 'Climbing Enrichment', 'Temperature Needs', 'Hiding Spots'],
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                animal: 'Aquatic Pets',
                icon: '🐠',
                topics: ['Water Quality', 'Swimming Exercise', 'Hiding Places', 'Water Plants'],
                color: 'from-cyan-500 to-blue-500'
              }
            ].map((category, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border-purple-100">
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-2xl font-bold">{category.animal}</h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center text-sm text-gray-600 hover:text-purple-600 cursor-pointer">
                        <ArrowRight className="mr-2 h-3 w-3" />
                        {topic}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                    Explore {category.animal} Health
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Consultation CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-purple-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6">
              Need Personalized Health Advice?
            </h2>
            
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Our certified animal behaviorists and veterinary partners are here to help you choose 
              the perfect toys and create enrichment plans tailored to your pet's specific needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 px-8">
                Schedule Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-purple-300 text-purple-100 hover:bg-purple-800/50 px-8"
              >
                Chat with Expert
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-200">24/7</div>
                <div className="text-purple-300">Expert Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-200">1000+</div>
                <div className="text-purple-300">Happy Pets Helped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-200">15min</div>
                <div className="text-purple-300">Average Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimalHealth;