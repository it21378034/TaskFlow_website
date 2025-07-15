import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileHeader = () => {
  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    jobTitle: "Senior Product Manager",
    department: "Product Development",
    joinDate: "January 2022",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    stats: {
      tasksCompleted: 247,
      projectsManaged: 12,
      teamMembers: 8
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary-600 rounded-lg p-8 text-white mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 border-4 border-white/30">
            <Image
              src={userInfo.avatar}
              alt={userInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-success rounded-full border-4 border-white flex items-center justify-center">
            <Icon name="Check" size={16} className="text-white" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{userInfo.name}</h1>
          <p className="text-primary-100 text-lg mb-1">{userInfo.jobTitle}</p>
          <p className="text-primary-200 mb-4">{userInfo.department}</p>
          
          <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-primary-100 mb-6">
            <div className="flex items-center space-x-1">
              <Icon name="Mail" size={16} />
              <span>{userInfo.email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>Joined {userInfo.joinDate}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {userInfo.stats.tasksCompleted}
              </div>
              <div className="text-xs text-primary-200 uppercase tracking-wide">
                Tasks Completed
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {userInfo.stats.projectsManaged}
              </div>
              <div className="text-xs text-primary-200 uppercase tracking-wide">
                Projects Managed
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {userInfo.stats.teamMembers}
              </div>
              <div className="text-xs text-primary-200 uppercase tracking-wide">
                Team Members
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col space-y-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-smooth">
            <Icon name="Edit" size={16} />
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-smooth">
            <Icon name="Share" size={16} />
            <span className="text-sm font-medium">Share Profile</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-smooth">
            <Icon name="Download" size={16} />
            <span className="text-sm font-medium">Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;