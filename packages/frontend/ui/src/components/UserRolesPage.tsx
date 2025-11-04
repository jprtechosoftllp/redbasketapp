import React from 'react';
import { Home, Shield, Users, Crown, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { Button } from '../button';

interface Role {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const UserRolesPage: React.FC = () => {
  const roles: Role[] = [
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access with ability to manage all users, settings, and configurations. Can perform any action within the platform.',
      icon: <Crown className="w-8 h-8" />,
      color: 'text-yellow-400'
    },
    {
      id: '2',
      name: 'Moderator',
      description: 'Can manage content, review user reports, and enforce community guidelines. Has elevated permissions for content moderation.',
      icon: <Shield className="w-8 h-8" />,
      color: 'text-blue-400'
    },
    {
      id: '3',
      name: 'Editor',
      description: 'Responsible for creating, editing, and publishing content. Can manage drafts and collaborate with team members on content creation.',
      icon: <Wrench className="w-8 h-8" />,
      color: 'text-green-400'
    },
    {
      id: '4',
      name: 'User',
      description: 'Standard access level with basic permissions. Can view content, interact with features, and manage their own profile settings.',
      icon: <Users className="w-8 h-8" />,
      color: 'text-purple-400'
    }
  ];

  const handleGoHome = () => {
    console.log('Navigating to home page...');
    // In a real app, you would use router navigation here
    // e.g., router.push('/') or window.location.href = '/'
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            User Roles
          </h1>
          <Button 
            onClick={handleGoHome}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <p className="text-gray-400 mb-8 text-center max-w-2xl mx-auto">
          Explore the different user roles and their permissions within the system. 
          Each role has specific capabilities designed to maintain security and efficiency.
        </p>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`${role.color}`}>
                    {role.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-100">
                      {role.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 leading-relaxed">
                  {role.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-900/50 border-gray-800 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg text-gray-100">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Contact your system administrator if you need clarification about role permissions 
                or require changes to your access level.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 User Management System
        </div>
      </footer>
    </div>
  );
};

export default UserRolesPage;