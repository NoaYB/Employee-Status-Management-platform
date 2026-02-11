import type { ComponentProps } from "react";

export const EditIcon = (props: ComponentProps<'svg'>) => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
            fill="currentColor"
        />
        <path
            d="M20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.29a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
            fill="currentColor"
        />
    </svg>
);
