import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { EditIcon } from './EditIcon';

interface AvatarUploaderProps {
    onUpload: (file: File) => void;
}

export const AvatarUploader = ({ onUpload }: AvatarUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
            e.target.value = '';
        }
    };

    return (
        <label className="edit-avatar-btn" title="Change photo">
            <EditIcon />
            <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </label>
    );
};
