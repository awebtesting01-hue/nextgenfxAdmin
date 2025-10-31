import { useState, useRef } from 'react';
import { FiChevronDown, FiPlus } from 'react-icons/fi';

interface ImageSetting {
    id: string;
    label: string;
    note: string;
    enabled: boolean;
    previewUrl?: string;
}

export default function ImageSettings() {
    const [settings, setSettings] = useState<ImageSetting[]>([
        { id: 'logo', label: 'Logo', note: 'Recommended: 200x200px', enabled: true },
        { id: 'favicon', label: 'Favicon', note: 'Recommended: 32x32px', enabled: true },
        { id: 'signup', label: 'Signup', note: 'Recommended: 400x300px', enabled: true },
        { id: 'signin', label: 'Sign In', note: 'Recommended: 400x300px', enabled: true },
        { id: 'verifyEmail', label: 'Verify Email Otp', note: 'Recommended: 300x200px', enabled: true },
        { id: 'verifyPhone', label: 'Verify Phone Otp', note: 'Recommended: 300x200px', enabled: true },
        { id: 'payment', label: 'Payment Successful', note: 'Recommended: 500x300px', enabled: true },
        { id: 'forgotPassword', label: 'Forgot Password', note: 'Recommended: 400x250px', enabled: true },
        { id: 'otpEmail', label: 'Forgot Password Otp Email', note: 'Recommended: 300x200px', enabled: true },
        { id: 'otpPhone', label: 'Forgot Password Otp Phone', note: 'Recommended: 300x200px', enabled: true },
        { id: 'resetPassword', label: 'Reset Password Setting', note: 'Recommended: 400x250px', enabled: true },
        { id: 'resetDone', label: 'Password Reset Done', note: 'Recommended: 400x250px', enabled: true }
    ]);

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setSettings(settings.map(setting =>
                setting.id === id ? { ...setting, previewUrl: event.target?.result as string } : setting
            ));
        };
        reader.readAsDataURL(file);
    };

    const toggleSetting = (id: string) => {
        setSettings(settings.map(setting =>
            setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
        ));
    };

    const toggleAccordion = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const addNewSetting = () => {
        const label = prompt('Enter label for the new image:');
        if (label) {
            const newSetting: ImageSetting = {
                id: `custom_${Date.now()}`,
                label,
                note: 'Custom image setting',
                enabled: true
            };
            setSettings([...settings, newSetting]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Image Settings</h2>

                <div className="space-y-4">
                    {settings.map((setting) => (
                        <div
                            key={setting.id}
                            className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all
                ${expandedId === setting.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                        >
                            <div
                                className="flex justify-between items-center p-4 cursor-pointer hover:bg-blue-50"
                                onClick={() => toggleAccordion(setting.id)}
                            >
                                <h3 className="font-medium text-gray-800">{setting.label}</h3>
                                <FiChevronDown
                                    className={`text-gray-500 transition-transform ${expandedId === setting.id ? 'transform rotate-180' : ''}`}
                                />
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out
                  ${expandedId === setting.id ? 'max-h-96 opacity-100 p-4 border-t' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                    <input
                                        type="file"
                                        ref={(el) => { fileInputRefs.current[setting.id] = el; }}
                                        onChange={(e) => handleImageUpload(setting.id, e)}
                                        accept="image/*"
                                        className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="w-16 h-16 flex-shrink-0 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                                        {setting.previewUrl ? (
                                            <img
                                                src={setting.previewUrl}
                                                alt={`${setting.label} Preview`}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                Preview
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 mb-4">{setting.note}</p>

                                <div className="flex items-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={setting.enabled}
                                            onChange={() => toggleSetting(setting.id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">
                                            Enable {setting.label}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addNewSetting}
                    className="mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FiPlus />
                    Add New Image
                </button>
            </div>
        </div>
    );
}