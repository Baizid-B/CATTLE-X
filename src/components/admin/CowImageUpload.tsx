import React, { useCallback, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface CowImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
}

const CowImageUpload: React.FC<CowImageUploadProps> = ({ 
    images, 
    onImagesChange, 
    maxImages = 10 
}) => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files) return;
        
        const fileArray = Array.from(files);
        
        // Check limit
        if (images.length + fileArray.length > maxImages) {
            toast.error(`সর্বোচ্চ ${maxImages}টি ছবি আপলোড করতে পারবেন`);
            return;
        }
        
        // Check file types
        const invalidFiles = fileArray.filter(f => !f.type.startsWith('image/'));
        if (invalidFiles.length > 0) {
            toast.error('শুধু মাত্র ছবি ফাইল আপলোড করুন');
            return;
        }
        
        // Check file sizes (max 5MB each)
        const largeFiles = fileArray.filter(f => f.size > 5 * 1024 * 1024);
        if (largeFiles.length > 0) {
            toast.error('প্রতিটি ছবি সর্বোচ্চ 5MB সাইজের হতে পারে');
            return;
        }
        
        setUploading(true);
        
        try {
            const newImageUrls: string[] = [];
            
            for (const file of fileArray) {
                toast.loading(`${file.name} আপলোড হচ্ছে...`);
                const result = await api.uploadImage(file);
                newImageUrls.push(result.url);
                toast.dismiss();
                toast.success(`${file.name} আপলোড সফল`);
            }
            
            onImagesChange([...images, ...newImageUrls]);
            toast.success(`${fileArray.length}টি ছবি আপলোড হয়েছে`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('ছবি আপলোড ব্যর্থ হয়েছে। ব্যাকএন্ড চেক করুন।');
        } finally {
            setUploading(false);
        }
    }, [images, maxImages, onImagesChange]);
    
    const handleRemoveImage = useCallback(async (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
        toast.success('ছবি সরানো হয়েছে');
    }, [images, onImagesChange]);
    
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    }, [handleFileUpload]);
    
    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors ${
                    uploading ? 'bg-secondary/50 cursor-wait' : 'hover:border-foreground/50 cursor-pointer'
                }`}
                onClick={() => {
                    if (!uploading) {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files);
                        input.click();
                    }
                }}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-foreground" size={32} />
                        <p className="text-sm text-muted-foreground">আপলোড হচ্ছে...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload size={32} className="text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            ক্লিক করুন অথবা ছবি ড্র্যাগ করুন
                        </p>
                        <p className="text-xs text-muted-foreground">
                            জেপিজি, পিএনজি, ওয়েবপি (সর্বোচ্চ 5MB)
                        </p>
                    </div>
                )}
            </div>
            
            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded border border-border"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(index);
                                }}
                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Image Count */}
            <p className="text-xs text-muted-foreground">
                {images.length} / {maxImages}টি ছবি
            </p>
        </div>
    );
};

export default CowImageUpload;
