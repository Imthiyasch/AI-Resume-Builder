'use client';

import { ResumeData } from '@/types/resume';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useState } from 'react';

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

interface Props {
    data: ResumeData;
}

export default function ResumePreview({ data }: Props) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        const element = document.getElementById('resume-preview-content');
        if (!element) return;

        try {
            // Temporarily remove shadow and border for clean PDF
            element.classList.remove('shadow-lg', 'border');

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            element.classList.add('shadow-lg', 'border');

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                format: 'a4',
                orientation: 'portrait'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${data.personalInfo.fullName || 'Resume'}.pdf`);
        } catch (err) {
            console.error('Failed to generate PDF', err);
        } finally {
            setDownloading(false);
        }
    };

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
                id="resume-preview-content"
                className="bg-white w-full shadow-lg border border-gray-200 overflow-hidden text-gray-900 relative"
                style={{ minHeight: '297mm' }}
            >
                {renderTemplate()}
            </div>
        </div>
    );
}
