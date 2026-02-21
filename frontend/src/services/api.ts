import { 
  educationData, 
  skillsData, 
  projectsData, 
  certificationsData, 
  socialData, 
  profileData 
} from '../data/portfolio';

export const api = {
  getEducation: async () => {
    return Promise.resolve(educationData);
  },

  getSkills: async () => {
    return Promise.resolve(skillsData);
  },

  getProjects: async () => {
    return Promise.resolve(projectsData);
  },

  getCertifications: async () => {
    return Promise.resolve(certificationsData);
  },

  getSocial: async () => {
    return Promise.resolve(socialData);
  },

  getProfile: async () => {
    return Promise.resolve(profileData);
  },

  sendMessage: async (data: Record<string, any>) => {
    console.log('Message sent:', data);
    return Promise.resolve({ success: true, message: 'Message sent successfully (mock)' });
  }
};
