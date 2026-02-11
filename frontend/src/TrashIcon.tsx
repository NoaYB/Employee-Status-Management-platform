import type { ComponentProps } from "react";

export const TrashIcon = (props: ComponentProps<'button'>) => (
    <button className="delete-btn" title="Delete employee" {...props}>
        ×
    </button>
);
