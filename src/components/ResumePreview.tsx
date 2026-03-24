'use client';

import { ResumeData } from '@/types/resume';
import { Download } from 'lucide-react';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import TechTemplate from './templates/TechTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import CompactTemplate from './templates/CompactTemplate';
import BoldTemplate from './templates/BoldTemplate';
import StartupTemplate from './templates/StartupTemplate';
import ATSCleanTemplate from './templates/ATSCleanTemplate';
import ATSProTemplate from './templates/ATSProTemplate';
import ATSSimpleTemplate from './templates/ATSSimpleTemplate';

interface Props {
    data: ResumeData;
}

export default function ResumePreview({ data }: Props) {
    const [downloading, setDownloading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownload = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `${data.personalInfo.fullName || 'Resume'}`,
        onBeforePrint: () => {
            setDownloading(true);
            return Promise.resolve();
        },
        onAfterPrint: () => setDownloading(false),
    });

    const renderTemplate = () => {
        const template = data.templateId || 'modern';
        switch (template) {
            case 'professional': return <ProfessionalTemplate data={data} />;
            case 'minimalist': return <MinimalistTemplate data={data} />;
            case 'creative': return <CreativeTemplate data={data} />;
            case 'executive': return <ExecutiveTemplate data={data} />;
            case 'tech': return <TechTemplate data={data} />;
            case 'elegant': return <ElegantTemplate data={data} />;
            case 'compact': return <CompactTemplate data={data} />;
            case 'bold': return <BoldTemplate data={data} />;
            case 'startup': return <StartupTemplate data={data} />;
            case 'ats-clean': return <ATSCleanTemplate data={data} />;
            case 'ats-pro': return <ATSProTemplate data={data} />;
            case 'ats-simple': return <ATSSimpleTemplate data={data} />;
            case 'modern':
            default:
                return <ModernTemplate data={data} />;
        }
    };

    return (
        <div className="w-full max-w-[210mm] flex flex-col items-center">
            <div className="w-full flex justify-end mb-4">
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition"
                >
                    <Download className="w-4 h-4" />
                    {downloading ? 'Generating PDF...' : 'Download PDF'}
                </button>
            </div>

            {/* A4 Aspect Ratio Container */}
            <div
                ref={contentRef}
                id="resume-preview-content"
                className="bg-white w-full shadow-lg border border-gray-200 overflow-hidden text-gray-900 relative"
                style={{ minHeight: '297mm' }}
            >
                {renderTemplate()}
            </div>
        </div>
    );
}
