export interface ResumeData {
    title: string;
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        website: string;
    };
    summary: string;
    experience: {
        id: string;
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
    education: {
        id: string;
        school: string;
        degree: string;
        startDate: string;
        endDate: string;
    }[];
    skills: string;
    projects: {
        id: string;
        name: string;
        description: string;
        link: string;
    }[];
    certifications: {
        id: string;
        name: string;
        issuer: string;
        date: string;
    }[];
}

export const defaultResumeData: ResumeData = {
    title: 'My Professional Resume',
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: '',
    projects: [],
    certifications: []
};
